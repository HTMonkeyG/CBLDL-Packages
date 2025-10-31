const { WrapperCursor } = require("./cursor.js")
  , { Vec3 } = require("./vec3.js")
  , { WrapperBlockVolume } = require("./structure.js")
  , { blockFromId } = require("./block.js");

class WrappingCommand {
  static Type = "";

  static deserialize(obj) {

  }

  constructor(type) {
    this.type = type;
  }

  execute(executor) {
    return executor;
  }
}

class WrappingCommandMove extends WrappingCommand {
  static Type = "move";

  static deserialize(obj) {
    var result = new WrappingCommandMove();

    result.mode = obj.mode || "absolute";
    result.p = Vec3.from(obj.pos);

    return result;
  }

  constructor() {
    super(WrappingCommandMove.Type);

    this.mode = "absolute";
    this.p = new Vec3(0, 0, 0);
  }

  execute(executor) {
    if (this.mode === "related")
      executor.cursor.move(this.p);
    else
      executor.cursor.moveTo(this.p);
    return true;
  }
}

class WrappingCommandTry extends WrappingCommand {
  static Type = "try";

  static deserialize(obj) {
    return new WrappingCommandTry();
  }

  constructor() {
    super(WrappingCommandTry.Type);
  }

  execute(executor) {
    if (!executor.blockVolume.isAir(executor.cursor))
      return false;
    executor.nextStage();
    return true;
  }
}

class WrappingCommandIf extends WrappingCommand {
  static Type = "if";

  static deserialize(obj) {

  }

  constructor() {
    super(WrappingCommandIf.Type);

    this.trueList = null;
    this.falseList = null;
  }
}

class WrappingCommandLoop extends WrappingCommand {
  static Type = "loop";

  static deserialize(obj) {
    var result = new WrappingCommandLoop();

    result.list = WrappingRuleCommandList.deserialize(obj.list);

    return result;
  }

  constructor() {
    super(WrappingCommandLoop.Type);

    this.list = null;
  }

  execute(executor) {

  }
}

class WrappingCommandFill extends WrappingCommand {
  static Type = "fill";

  static deserialize(obj) {
    var result = new WrappingCommandFill();

    result.p1 = Vec3.from(obj.p1);
    result.p2 = Vec3.from(obj.p2);

    result.block = obj.block || "minecraft:air";

    return result;
  }

  constructor() {
    super(WrappingCommandFill.Type);

    this.block = "minecraft:air";
    this.p1 = new Vec3(0, 0, 0);
    this.p2 = new Vec3(0, 0, 0);
  }

  execute(executor) {
    executor.blockVolume.fill(this.p1, this.p2, blockFromId(this.block));
    return true;
  }
}

class WrappingRuleCommandList extends Array {
  static deserialize(obj, avaliableCommands) {
    if (!obj)
      return new WrappingRuleCommandList();

    var result = new WrappingRuleCommandList();

    avaliableCommands || (avaliableCommands = DefaultCommandList);

    for (var e of obj) {
      if (avaliableCommands[e.type])
        result.push(avaliableCommands[e.type].deserialize(e));
      else
        throw new Error("Invalid command.");
    }

    return result;
  }

  [Symbol.iterator]() {
    var list = this
      , ip = 0;

    return {
      next: function () {
        var value = list[ip]
          , done = false;

        ip++;
        if (ip >= list.length)
          done = true;

        return {
          value,
          done
        }
      }
    }
  }
}

class WrappingRule {
  static deserialize(obj, avaliableCommands) {
    var result = new WrappingRule();

    for (var s of ["begin", "module", "chain", "block"])
      result[s] = WrappingRuleCommandList.deserialize(obj[s], avaliableCommands);

    result.maxTryCount = obj.max_try_count || 100;

    return result;
  }

  constructor() {
    this.begin = null;
    this.module = null;
    this.chain = null;
    this.block = null;

    this.maxTryCount = 100;
  }

  createExecutor(callback) {
    var result = new WrappingRuleExecutor(callback);
    result.rule = this;
    return result;
  }
}

class WrappingRuleExecutor {
  constructor(placeCallback) {
    this.rule = null;

    this.stage = null;
    this.list = null;
    this.ip = 0;
    this.done = false;

    this.stack = [];
    this.variables = {};
    this.variableStack = [];

    this.cursor = new WrapperCursor();
    this.blockVolume = new WrapperBlockVolume();

    this.placeCallback = placeCallback || null;
  }

  reset() {
    this.list = this.stage = this.rule.begin;
    this.ip = 0;
    this.cursor = new WrapperCursor();
    this.blockVolume = new WrapperBlockVolume();
    this.stack = [];
    this.done = false;
  }

  getFrame() {
    return this.stack.length
  }

  setFrame(i) {
    if (i < 0)
      i = 0;
    this.stack.splice(i);
  }

  pushFrame(list) {
    this.stack.push({
      ip: this.ip,
      list: this.list,
      variableStack: this.variableStack
    });

    this.ip = 0;
    this.list = list;
    this.variableStack = [];

    return this.stack.length;
  }

  popFrame() {
    var frame = this.stack.pop();

    if (!frame)
      return 0;

    this.ip = frame.ip;
    this.list = frame.list;
    this.variableStack = frame.variableStack;

    return this.stack.length;
  }

  queryVariable(path) {

  }

  getStage() {
    if (!this.stage)
      return null;

    if (this.stage == this.rule.begin)
      return "begin";
    else if (this.stage == this.rule.module)
      return "module";
    else if (this.stage == this.rule.chain)
      return "chain";
    else if (this.stage == this.rule.block)
      return "block";
    else
      return null;
  }

  nextStage() {
    if (!this.stage)
      this.stage = this.rule.begin;

    if (this.stage == this.rule.begin)
      // We ignore the `try` commands when the executor is executing the beginning
      // command list.
      return;

    if (this.stage == this.rule.module)
      this.stage = this.rule.chain;
    else if (this.stage == this.rule.chain)
      this.stage = this.rule.block;

    this.pushFrame(this.stage);

    if (this.stage == this.rule.block)
      this.tryPlaceAtCursor();
  }

  /**
   * Switch to the `module` stage from the `begin` stage.
   */
  endBegin() {
    if (this.stage == this.rule.begin)
      this.stage = this.rule.module;
    this.list = this.stage;
    this.ip = 0;
    // Reset the stack.
    this.setFrame(0);
  }

  tryPlaceAtCursor() {
    if (this.placeCallback)
      return this.placeCallback(this.cursor, this);
    return true;
  }

  nextModule() {

  }

  nextChain() {

  }

  nextBlock() {

  }

  /**
   * Step once.
   * @returns {boolean} True when reached the end of the command list.
   */
  step() {
    if (!this.list || !this.list.length) {
      this.popFrame();
      return true;
    }

    if (this.ip > this.list.length) {
      // Pop and restore stack frame.
      this.popFrame();
    }

    this.list[this.ip].execute(this);
    this.ip++;

    if (this.ip >= this.list.length)
      return true;

    return false;
  }

  /**
   * Execute until the end of current command list.
   */
  runList() {
    while (!this.step());
  }
}

const DefaultCommandList = Object.freeze({
  [WrappingCommandFill.Type]: WrappingCommandFill,
  [WrappingCommandMove.Type]: WrappingCommandMove,
  [WrappingCommandTry.Type]: WrappingCommandTry,
  [WrappingCommandLoop.Type]: WrappingCommandLoop
});

module.exports = {
  WrappingCommand,
  WrappingCommandFill,
  WrappingCommandIf,
  WrappingCommandLoop,
  WrappingCommandMove,
  WrappingCommandTry,
  WrappingRuleCommandList,
  WrappingRule,
  WrappingRuleExecutor,
  DefaultCommandList
};
