class CBGMetaCommand {
  constructor(type) {
    this.type = type;
  }
}

class CBGMetaCommandVanilla extends CBGMetaCommand {
  constructor(command) {
    super("vanilla");

    this.command = command;
  }
}

class CBGMetaCommandTagged extends CBGMetaCommand {
  constructor(command) {
    super("tagged");

    this.command = command;
  }
}

class CBGMetaCommandCoroutine extends CBGMetaCommand {
  constructor(module) {
    super("coroutine");

    this.moduleName = module;
  }
}

module.exports = {
  CBGMetaCommand,
  CBGMetaCommandVanilla,
  CBGMetaCommandTagged,
  CBGMetaCommandCoroutine
};
