class CBGMetaCommand {
  constructor(type) {
    this.type = type;
  }
}

class CBGMetaCommandVanilla extends CBGMetaCommand {
  static Type = "vanilla";

  constructor(command) {
    super(CBGMetaCommandVanilla.Type);

    this.command = command;
  }
}

class CBGMetaCommandTagged extends CBGMetaCommand {
  static Type = "tagged";

  constructor(command) {
    super(CBGMetaCommandTagged.Type);

    this.command = command;
  }
}

class CBGMetaCommandCoroutine extends CBGMetaCommand {
  static Type = "coroutine";

  constructor(module) {
    super(CBGMetaCommandCoroutine.Type);

    this.moduleName = module;
  }
}

module.exports = {
  CBGMetaCommand,
  CBGMetaCommandVanilla,
  CBGMetaCommandTagged,
  CBGMetaCommandCoroutine
};
