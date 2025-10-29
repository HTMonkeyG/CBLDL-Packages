import { CBGChain } from "./cbg";

export declare class CBGMetaCommand {
  constructor(type: string);

  type: string;
  subChain: CBGChain;
}

export declare class CBGMetaCommandVanilla extends CBGMetaCommand {
  readonly static Type: "vanilla";

  constructor(command: string);

  command: string;
}

export declare class CBGMetaCommandTagged extends CBGMetaCommand {
  readonly static Type: "tagged";

  constructor(command: object[]);

  command: object[];
}

export declare class CBGMetaCommandCoroutine extends CBGMetaCommand {
  readonly static Type: "coroutine";

  constructor(module: string);

  moduleName: string;
}