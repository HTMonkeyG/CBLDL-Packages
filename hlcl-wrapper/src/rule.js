const { WrapperCursor } = require("./cursor.js")
  , { Vec3 } = require("./vec3.js")
  , { WrapperBlockVolume } = require("./structure.js")
  , { blockFromId } = require("./block.js");

class WrappingCommand {
  constructor(type) {
    this.type = type;
  }

  execute(executor) {
    return executor;
  }
}

class WrappingCommandMove extends WrappingCommand {
  static Type = "try";

  static deserialize(obj) {
    var result = new WrappingCommandMove();

    result.mode = obj.mode || "absolute";
    result.p = Vec3.from(obj.vector);

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
  }
}

class WrappingCommandTry extends WrappingCommand {
  static Type = "try";

  constructor() {
    super(WrappingCommandTry.Type);
  }

  execute(executor) {
    if (!executor.blockVolume.isAir(executor.cursor))
      return;
    executor.nextStage();
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
  }
}

class WrappingRuleCommandList extends Array {
  static deserialize(obj, avaliableCommands) {
    var result = new WrappingRuleCommandList;

    for (var e of obj) {
      if (avaliableCommands[e.type])
        result.push(avaliableCommands[e.type].deserialize(e));
      else
        throw new Error("Invalid command.");
    }

    return result;
  }
}

class WrappingRule {
  static deserialize(obj, avaliableCommands) {
    var result = new WrappingRule();
  }

  constructor() {
    this.begin = null;
    this.module = null;
    this.chain = null;
    this.block = null;

    this.maxTryCount = 100;
  }

  createExecutor() {
    return new WrappingRuleExecutor();
  }
}

class WrappingRuleExecutor {
  constructor() {
    this.rule = null;

    this.stage = null;
    this.list = null;
    this.ip = 0;

    this.stack = [];
    this.variables = {};

    this.cursor = new WrapperCursor();
    this.blockVolume = new WrapperBlockVolume();
  }

  pushFrame(list) {
    this.stack.push({
      ip: this.ip,
      list: this.list
    });

    this.ip = 0;
    this.list = list;

    return this.stack.length;
  }

  popFrame() {
    var frame = this.stack.pop();

    this.ip = frame.ip;
    this.list = frame.list;

    return this.stack.length;
  }

  queryVariable(path) {

  }

  step() {

  }

  nextStage() {
    if (!this.stage)
      this.stage = this.rule.begin;

    if (this.stage == this.rule.begin)
      this.stage = this.rule.module;
    else if (this.stage == this.rule.module)
      this.stage = this.rule.module;
    else if (this.stage == this.rule.chain)
      this.stage = this.rule.block;

    this.pushFrame(this.stage);

    if (this.stage == this.rule.block)
      console.log("place.");
  }

  nextModule() {

  }

  nextChain() {

  }

  nextBlock() {

  }
}

module.exports = {
  WrappingCommand,
  WrappingCommandFill,
  WrappingCommandIf,
  WrappingCommandMove,
  WrappingCommandTry,
  WrappingRuleCommandList,
  WrappingRule,
  WrappingRuleExecutor
};
