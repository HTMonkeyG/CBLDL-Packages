const { Vec3 } = require("./vec3.js")
  , MCS = require("mcstructure-js");

class WrapperBlockVolume {
  static hash(pos) {
    // Convert to signed 32bit integer.
    var x = Number(pos.x) | 0
      , y = Number(pos.y) | 0
      , z = Number(pos.z) | 0;

    return x + "/" + y + "/" + z;
  }

  static unhash(s) {
    s = s.split("/");
    return new Vec3(
      Number(s[0]) | 0,
      Number(s[1]) | 0,
      Number(s[2]) | 0
    );
  }

  constructor() {
    this.blocks = {};
    this.blockEntities = {};
  }

  getBlock(pos) {
    return this.blocks[WrapperBlockVolume.hash(pos)];
  }

  isAir(pos) {
    var block = this.getBlock(pos);
    return !block || !block.name || block.name === "minecraft:air";
  }

  setBlock(pos, block) {
    this.blocks[WrapperBlockVolume.hash(pos)] = block;
  }

  fill(pos1, pos2, block) {
    var min, max;
    min = new Vec3(
      Math.min(pos1.x, pos2.x),
      Math.min(pos1.y, pos2.y),
      Math.min(pos1.z, pos2.z)
    );
    max = new Vec3(
      Math.min(pos1.x, pos2.x),
      Math.min(pos1.y, pos2.y),
      Math.min(pos1.z, pos2.z)
    );

    for (var xC = min.x; xC <= max.x; xC++)
      for (var zC = min.z; zC <= max.z; zC++)
        for (var yC = min.y; yC <= max.y; yC++)
          this.setBlock(new Vec3(xC, yC, zC), block);
  }

  getBlockData(pos) {
    return this.blockEntities[WrapperBlockVolume.hash(pos)];
  }

  setBlockData(pos, blockData) {
    this.blockEntities[WrapperBlockVolume.hash(pos)] = blockData;
  }

  getMax() {
    var r = {
      x: -2147483648,
      y: -2147483648,
      z: -2147483648
    };

    for (var k in this.blocks) {
      var pos = WrapperBlockVolume.unhash(k);
      r.x = Math.max(r.x, pos.x);
      r.y = Math.max(r.y, pos.y);
      r.z = Math.max(r.z, pos.z);
    }

    return Vec3.from(r);
  }

  getMin() {
    var r = {
      x: 2147483647,
      y: 2147483647,
      z: 2147483647
    };

    for (var k in this.blocks) {
      var pos = WrapperBlockVolume.unhash(k);
      r.x = Math.min(r.x, pos.x);
      r.y = Math.min(r.y, pos.y);
      r.z = Math.min(r.z, pos.z);
    }

    return Vec3.from(r);
  }

  getSize() {
    var min = this.getMin()
      , max = this.getMax();
    return {
      x: max.x - min.x + 1,
      y: max.y - min.y + 1,
      z: max.z - min.z + 1,
      min: min,
      max: max
    }
  }

  toMCS() {
    var size = this.getSize()
      , min = size.min
      , result;

    if (!(size.x * size.y * size.z))
      // Empty structure.
      return null;
    if (size.x > 128 || size.y > 128 || size.z > 128)
      // The structure's size is limited.
      return null;

    result = new MCS(size.x, size.y, size.z);

    for (var k of this.blocks) {
      var pos = WrapperBlockVolume.unhash(k).sub(min);
      result.setBlock(pos, this.blocks[k]);
      if (this.blockEntities[k])
        result.setBlockData(pos, this.blockEntities[k]);
    }

    return result;
  }
}

exports.WrapperBlockVolume = WrapperBlockVolume;
