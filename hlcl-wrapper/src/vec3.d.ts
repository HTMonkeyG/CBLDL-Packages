export declare class Vec3 {
  static from(vecLike: { x: number, y: number, z: number }): Vec3;

  constructor(x: number, y: number, z: number);

  x: number;
  y: number;
  z: number;

  add(a: { x: number, y: number, z: number } | Vec3): Vec3;
  sub(a: { x: number, y: number, z: number } | Vec3): Vec3;
  scale(s: number): Vec3;
  length(): number;
  toString(): string;
}