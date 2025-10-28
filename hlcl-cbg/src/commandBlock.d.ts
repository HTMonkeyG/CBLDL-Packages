import { CBGMetaCommand } from "./metaCommand";

export declare class CB {
  static Type: {
    Pulse: 0,
    Repeat: 1,
    Chain: 2
  };

  constructor();

  /** 
   * The type of the command block.
   */
  type: 0 | 1 | 2;
  redstone: boolean;
  conditional: boolean;
  delay: number;
  metaCommand: CBGMetaCommand;
}
