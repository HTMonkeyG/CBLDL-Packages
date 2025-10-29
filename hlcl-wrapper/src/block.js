const PMR = require("project-mirror-registry")
  , { CBGMetaCommandVanilla } = require("hlcl-cbg");

function blockFromCB(cb) {
  var block = PMR.createUniversalTag("block")
    , blockEntity;

  if (cb.command !== CBGMetaCommandVanilla.Type)
    return null;

  block.name = [
    "minecraft:command_block",
    "minecraft:repeating_command_block",
    "minecraft:chain_command_block"
  ][cb.type];

  blockEntity = PMR.createBlockEntity(block.name);

  blockEntity.Command = cb.command;
  blockEntity.auto = cb.redstone;
  blockEntity.conditionalMode = cb.conditional;
  blockEntity.conditionMet = !cb.conditional;
  blockEntity.LPConditionalMode = cb.conditional;
  blockEntity.LPRedstoneMode = cb.redstone;

  return {
    block,
    blockEntity
  };
}

function blockFromId(id) {
  var block = PMR.createUniversalTag("block");

  block.name = id || "minecraft:air";

  return block;
}

module.exports = {
  blockFromCB,
  blockFromId
};
