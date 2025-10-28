class CBGSymbol {
  constructor(type, name) {
    this.type = type;
    this.name = name;
  }
}

class CBGSymbolScore extends CBGSymbol {
  constructor(name) {
    super("score", name);

    this.entity = null;
    this.object = null;
  }
}

class CBGSymbolConstant extends CBGSymbol {
  constructor(name) {
    super("const", name);

    this.content = null;
  }
}

class CBGSymbolTable {
  static merge(...tables) {
    
  }

  constructor() {
    this.symbols = new Map();
  }

  addSymbol(symbol) {
    if (this.symbols.has(symbol.name))
      return false;
    this.symbols.set(symbol.name, symbol);
  }
}

exports.CBGSymbol = CBGSymbol;
exports.CBGSymbolScore = CBGSymbolScore;
exports.CBGSymbolConstant = CBGSymbolConstant;
exports.CBGSymbolTable = CBGSymbolTable;
