/**
 * This interface is environment-related.
 * 
 * Please implement this interface when port to another runtime environment.
 */
export declare class FileInterface {
  /**
   * Returns `true` if the path exists, `false` otherwise.
   * @param {string} path 
   * @returns {boolean}
   */
  existSync(path: string): boolean;

  /**
   * Synchronously reads the entire contents of a file.
   * @param {string} path 
   * @returns {string}
   */
  readFileSync(path: string): string;
}