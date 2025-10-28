const { CB } = require("./commandBlock.js");

class CBGChain {
  constructor(name, parent) {
    this.name = (name + "") || "";
    this.head = null;
    this.commands = [];
    this.parent = parent || null;
  }

  setHead(cb) {
    if (this.head)
      return null;
    if (cb) {
      if (!(cb instanceof CB))
        return null;

      // The head must be the first command block of the chain.
      this.head = cb;
      this.commands.unshift(cb);

      return this;
    } else {
      // If `cb` is not specified, then set the first block of the chain as
      // the head.
      if (!this.commands.length)
        return null;

      this.head = this.commands[0];

      return this;
    }
  }

  concat(chain) {
    if (!(chain instanceof CBGChain))
      return null;
    if (chain.head)
      return null;

    this.commands = this.commands.concat(chain.commands);

    return this;
  }

  append(cb) {
    if (!cb || !(cb instanceof CB))
      return null;

    this.commands.push(cb);

    return this;
  }
}

class CBGModule {
  constructor(name, parent) {
    this.name = (name + "") || "";
    this.chains = [];
    this.parent = parent || null;
  }

  addChain(chain) {
    if (!chain || !(chain instanceof CBGChain))
      return null;

    this.chains.push(chain);

    return this;
  }
}

class CBG {
  constructor() {
    this.formatVersion = 0;
    this.engineVersion = 0;
    this.modules = [];
    this.importSymbol = null;
    this.exportSymbol = null;
  }
}

exports.CBGChain = CBGChain;
exports.CBGModule = CBGModule;
exports.CBG = CBG;
