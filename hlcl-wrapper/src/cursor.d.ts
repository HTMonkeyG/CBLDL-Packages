import { Vec3 } from "./vec3";

export declare class WrapperCursor {
  static readonly BlockFacing: {
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

  static readonly FacingFlags: {
    // Pitch.
    // Horizontal forward.
    YZ: 0,
    // Y positive.
    YN: 1,
    // Y negative.
    YP: 2,

    // Yaw.
    // Z negative.
    ZN: 0,
    // Z positive.
    ZP: 4,
    // X negative.
    XN: 8,
    // X positive.
    XP: 12,

    VMask: 0x03,
    HMask: 0x0C
  };

  static copy(cursor: WrapperCursor): WrapperCursor;

  constructor();

  pos: Vec3;
  facing: number;

  convertFacing(facing: number): number;
  getFacing(facingRelated: { x: number, y: number, z: number } | Vec3): Vec3;
  setFacing(facing: number): WrapperCursor;

  get(related: { x: number, y: number, z: number } | Vec3): Vec3;
  moveTo(pos: { x: number, y: number, z: number } | Vec3): WrapperCursor;
  move(related: { x: number, y: number, z: number } | Vec3): WrapperCursor;
  moveFacing(facingRelated: { x: number, y: number, z: number } | Vec3): WrapperCursor;
}