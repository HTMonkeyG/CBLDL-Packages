class Vec3 {
  static from(vecLike) {
    return new Vec3(
      vecLike.x,
      vecLike.y,
      vecLike.z
    )
  }

  constructor(x, y, z) {
    this.x = Number(x) || 0;
    this.y = Number(y) || 0;
    this.z = Number(z) || 0;
  }

  add(a) {
    return new Vec3(
      this.x + a.x,
      this.y + a.y,
      this.z + a.z
    );
  }

  sub(a) {
    return new Vec3(
      this.x - a.x,
      this.y - a.y,
      this.z - a.z
    );
  }

  scale(s) {
    return new Vec2(
      this.x * s,
      this.y * s,
      this.z * s
    );
  }

  length() {
    return Math.hypot(this.x, this.y, this.z);
  }

  toString() {
    return "(" + this.x + ", " + this.y + ", " + this.z + ")"
  }
}

exports.Vec3 = Vec3;
