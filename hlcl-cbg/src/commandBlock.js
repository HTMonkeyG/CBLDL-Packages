class CB {
  static Type = {
    Pulse: 0,
    Repeat: 1,
    Chain: 2
  };

  constructor() {
    this.type = CB.Type.Chain;
    this.redstone = true;
    this.conditional = false;
    this.delay = 0;
    this.metaCommand = null;
  }
}

exports.CB = CB;
