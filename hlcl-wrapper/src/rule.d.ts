export declare class WrappingRuleCommandList {

}

export declare class WrappingRule {
  constructor();

  begin: WrappingRuleCommandList;
  module: WrappingRuleCommandList;
  chain: WrappingRuleCommandList;
  block: WrappingRuleCommandList;
}