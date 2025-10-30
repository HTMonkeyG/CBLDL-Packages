import { WrapperCursor } from "./cursor";
import { WrapperBlockVolume } from "./structure";

export declare class WrappingCommand {
  static readonly Type: string;
  static deserialize(obj: object): WrappingCommand;
  constructor();
  readonly type: string;
}

export declare class WrappingCommandMove extends WrappingCommand {
  static readonly Type: "move";
  static deserialize(obj: object): WrappingCommandMove;

  constructor();

  readonly type: "move";
  mode: "absolute" | "related";
  p: { x: number, y: number, z: number };
}

export declare class WrappingCommandTry extends WrappingCommand {
  static readonly Type: "try";
  static deserialize(obj: object): WrappingCommandTry;
  constructor();
  readonly type: "try";
}

export declare class WrappingCommandFill extends WrappingCommand {
  static readonly Type: "fill";
  static deserialize(obj: object): WrappingCommandFill;

  constructor();

  readonly type: "fill";
  p1: { x: number, y: number, z: number };
  p2: { x: number, y: number, z: number };
  block: string;
}

export declare class WrappingRuleCommandList extends Array {
  static deserialize(obj: object[], avaliableCommands?: object): WrappingRuleCommandList;
  constructor();
}

export declare class WrappingRule {
  static deserialize(obj: object, avaliableCommands?: object): WrappingRule;
  constructor();

  begin: WrappingRuleCommandList;
  module: WrappingRuleCommandList;
  chain: WrappingRuleCommandList;
  block: WrappingRuleCommandList;
  maxTryCount: number;

  createExecutor(): WrappingRuleExecutor;
}

export declare class WrappingRuleExecutor {
  constructor();

  readonly stack: { ip: number, list: WrappingRuleCommandList }[];
  readonly stage: WrappingRuleCommandList;
  readonly list: WrappingRuleCommandList;
  readonly ip: number;
  cursor: WrapperCursor;
  rule: WrappingRule;
  variables: object;
  blockVolume: WrapperBlockVolume;

  pushFrame(list: WrappingRuleCommandList): number;
  popFrame(): number;
}

export const DefaultCommandList: object;
