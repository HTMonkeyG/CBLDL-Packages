import { Vec3 } from "./vec3";

export declare class WrapperBlockVolume {
  static hash(pos: Vec3): string;
  static unhash(s: string): Vec3;

  constructor();

  blocks: object;
  blockEntities: object;

  getBlock(pos: Vec3): object;
  isAir(pos: Vec3): boolean;
  setBlock(pos: Vec3, block: object): void;
  fill(pos1: Vec3, pos2: Vec3, block: object): void;
  getBlockData(pos: Vec3): object
  setBlockData(pos: Vec3, blockData: object): void;
  getMax(): Vec3;
  getMin(): Vec3;
  getSize(): {
    x: number,
    y: number,
    z: number,
    min: Vec3,
    max: Vec3
  };
  toMCS(): object;
}
