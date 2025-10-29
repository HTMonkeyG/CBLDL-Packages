const { Vec3 } = require("./vec3.js");

class WrapperCursor {
  static BlockFacing = {
    // Y positive.
    YN: 0,
    // Y negative.
    YP: 1,
    // Z negative.
    ZN: 2,
    // Z positive.
    ZP: 3,
    // X negative.
    XN: 4,
    // X positive.
    XP: 5
  };

  static FacingFlags = {
    // Pitch.
    // Horizontal forward.
    YZ: 0 << 0,
    // Y positive.
    YN: 1 << 0,
    // Y negative.
    YP: 2 << 0,

    // Yaw.
    // Z negative.
    ZN: 0 << 2,
    // Z positive.
    ZP: 1 << 2,
    // X negative.
    XN: 2 << 2,
    // X positive.
    XP: 3 << 2,

    VMask: 0x03,
    HMask: 0x0C
  };

  static copy(cursor) {
    var result = new WrapperCursor();
    result.pos = cursor.pos;
    result.facing = cursor.facing;
    return result;
  }

  constructor() {
    this.pos = new Vec3(0, 0, 0);
    this.facing = WrapperCursor.FacingFlags.YP;
  }

  get(related) {
    if (!related)
      return this.pos;
    return this.pos.add(Vec3.from(related));
  }

  getFacing(facingRelated) {
    var result = Vec3.from(this.pos)
      , related = Vec3.from(facingRelated);

    if ((this.facing & WrapperCursor.FacingFlags.VMask) == WrapperCursor.FacingFlags.YN)
      [related.x, related.y, related.z] = [related.x, -related.z, related.y];
    else if ((this.facing & WrapperCursor.FacingFlags.VMask) == WrapperCursor.FacingFlags.YP)
      [related.x, related.y, related.z] = [related.x, related.z, -related.y];

    result.y += related.y;

    switch (this.facing & WrapperCursor.FacingFlags.HMask) {
      case WrapperCursor.FacingFlags.ZN:
        result.x -= related.x;
        result.z -= related.z;
        return result;
      case WrapperCursor.FacingFlags.ZP:
        result.x += related.x;
        result.z += related.z;
        return result;
      case WrapperCursor.FacingFlags.XN:
        result.x -= related.z;
        result.z += related.x;
        return result;
      case WrapperCursor.FacingFlags.XP:
        result.x += related.z;
        result.z -= related.x;
        return result;
    }
  }

  setFacing(facing) {
    this.facing = facing & 0x0F;
    if ((this.facing & WrapperCursor.FacingFlags.VMask) == WrapperCursor.FacingFlags.VMask)
      this.facing &= WrapperCursor.FacingFlags.HMask;
    return this;
  }

  moveTo(pos) {
    this.pos = Vec3.from(pos);
    return this;
  }

  move(related) {
    this.pos = this.pos.add(Vec3.from(related));
    return this;
  }

  moveFacing(facingRelated) {
    this.moveTo(this.getFacing(facingRelated));
    return this;
  }
}

exports.WrapperCursor = WrapperCursor;
