import { CBGChain } from "./cbg";

export declare class CBGMetaCommand {
  constructor(type: string);

  type: string;
  subChain: CBGChain;
}

export declare class CBGMetaCommandVanilla extends CBGMetaCommand {
  static readonly Type: "vanilla";

  constructor(command: string);

  command: string;
}

export declare class CBGMetaCommandTagged extends CBGMetaCommand {
  static readonly Type: "tagged";

  constructor(command: object[]);

  command: object[];
}

export declare class CBGMetaCommandCoroutine extends CBGMetaCommand {
  static readonly Type: "coroutine";

  constructor(module: string);

  moduleName: string;
}