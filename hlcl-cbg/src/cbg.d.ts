import { CB } from "./commandBlock";
import { CBGSymbolTable } from "./symbol";

export declare class CBGChain {
  constructor(name: string, parent: CBGModule);

  readonly name: string;
  readonly commands: CB[];
  readonly head: CB;

  setHead(cb: CB | null): null | CBGChain;
  concat(chain: CBGChain): null | CBGChain;
  append(cb: CB): null | CBGChain;
}

export declare class CBGModule {
  constructor(name: string, parent: CBG);

  readonly name: string;
  readonly chains: CBGChain[];

  addChain(chain: CBGChain): null | CBGModule;
}

export declare class CBG {
  constructor();

  formatVersion: number;
  engineVersion: number;
  modules: CBGModule[];
  importSymbol: CBGSymbolTable | null;
  exportSymbol: CBGSymbolTable | null;
}
