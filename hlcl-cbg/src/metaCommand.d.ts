import { CBGChain } from "./cbg";

export declare class CBGMetaCommand {
  constructor(type: string);

  type: string;
  subChain: CBGChain;
}

export declare class CBGMetaCommandVanilla extends CBGMetaCommand {
  constructor(command: string);

  command: string;
}

export declare class CBGMetaCommandTagged extends CBGMetaCommand {
  constructor(command: object[]);

  command: object[];
}

export declare class CBGMetaCommandCoroutine extends CBGMetaCommand {
  constructor(module: string);

  moduleName: string;
}