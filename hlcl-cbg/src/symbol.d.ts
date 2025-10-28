export declare class CBGSymbol {
  constructor(type: string, name: string);

  type: string;
  name: string;
}

export declare class CBGSymbolScore extends CBGSymbol {
  constructor(name: string);

  entity: object;
  object: object;
}

export declare class CBGSymbolConstant extends CBGSymbol {
  constructor(name: string);

  content: object;
}

export declare class CBGSymbolTable {
  static merge(...tables: CBGSymbolTable[]): CBGSymbolTable;

  constructor();

  symbols: Map<string, CBGSymbol>;

  addSymbol(symbol: CBGSymbol): CBGSymbolTable;
}
