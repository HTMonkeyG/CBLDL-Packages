const { WrapperBlockVolume } = require("./src/structure.js");
const { Vec3 } = require("./src/vec3.js");
const { WrapperCursor } = require("./src/cursor.js");
const {
  WrappingRule,
  WrappingCommand,
  WrappingCommandFill,
  WrappingCommandMove,
  WrappingCommandTry,
  WrappingRuleCommandList,
  WrappingRuleExecutor,
  DefaultCommandList
} = require("./src/rule.js");

class CLWrapper {
  constructor(cbg) {
    this.cursor = new WrapperCursor();
    this.cbg = cbg || null;
    this.rule = null;
  }

  setRule(rule) {
    this.rule = rule;
  }

  run() {
    function airBlock(block) {
      return !block || !block.name || block.name === "minecraft:air";
    }

    function nextModule(cursor, blockVolume) {
      if (airBlock(blockVolume.getBlock(cursor.pos)))
        return WrapperCursor.copy(cursor);
      while (!airBlock(blockVolume.getBlock(cursor.pos)))
        cursor.move(new Vec3(1, 0, 0));
      return WrapperCursor.copy(cursor);
    }

    function nextChain(cursor, blockVolume) {
      if (airBlock(blockVolume.getBlock(cursor.pos)))
        return WrapperCursor.copy(cursor);
      while (!airBlock(blockVolume.getBlock(cursor.pos)))
        cursor.move(new Vec3(0, 0, 1));
      return WrapperCursor.copy(cursor);
    }

    function nextBlock(cursor, blockVolume) {
      cursor.move(new Vec3(0, 1, 0));
      return WrapperCursor.copy(cursor);
    }

    var result = null;
    if (!this.cbg || !this.rule)
      return null;

    result = new WrapperBlockVolume();

    for (var module of this.cbg.modules) {
      this.cursor = nextModule(this.cursor, result);
      for (var chain of module.chains) {
        this.cursor = nextChain(this.cursor, result);
        for (var cb of chain.commands) {
          this.cursor = nextBlock(this.cursor, result);
          console.log(this.cursor, cb.metaCommand)
        }
      }
    }
  }

  reset() {

  }
}

var a = new CLWrapper()

module.exports = {
  CLWrapper,
  WrappingCommand,
  WrappingCommandFill,
  WrappingCommandMove,
  WrappingCommandTry,
  WrappingRuleCommandList,
  WrappingRule,
  WrappingRuleExecutor,
  DefaultCommandList
};
