export declare class FileSlice {
  /**
   * Create a copy of `a` or copy `a` to `b`.
   * @param {FileSlice} a 
   * @param {FileSlice} b 
   * @returns {FileSlice}
   */
  static copy(a: FileSlice, b: FileSlice): FileSlice;

  /**
   * @param {string} file - File Path.
   * @param {string} content - Original file content.
   * @param {number} [start] - Slice start position in the file, in lines.
   * @param {number} [line] - Slice size, in lines.
   * @param {FileSlice} [next] - Next slice.
   * @returns {FileSlice}
   */
  static fromFile(file: string, content: string, start?: number, line?: number, next?: FileSlice):FileSlice;

  constructor();

  /** File path. */
  file: string;
  /** Content of this slice. */
  content: string[];
  /** Start position. */
  parentLine: number;
  /** Amount of lines this slice contains. */
  size: number;
  /** Next slice. */
  next: FileSlice | null;

  /**
   * Get the content of the file slice chain.
   * @returns {string}
   */
  getContent(): string;

  /**
   * Get the specified line in the current slice.
   * @param {number} line 
   */
  getLine(line: number): string;

  /**
   * Insert a `FileSlice` object before the specified line.
   * @param {number} start - Start line.
   * @param {FileSlice} inserted - The `FileSlice` object to be inserted.
   * @returns {FileSlice}
   */
  insert(start: number, inserted: FileSlice): FileSlice;

  /**
   * Replace lines with empty line.
   * @param {number} line - Line number in current slice.
   * @param {number} [count] 
   * @returns {FileSlice}
   */
  clear(line: number, count: number): FileSlice;

  /**
   * Cut a section of a FileSlice.
   * @param {number} start 
   * @param {number} line 
   * @returns {FileSlice}
   */
  slice(start: number, line: number): FileSlice;

  /**
   * Duplicate a section of the FileSlice chain.
   * @param {number} start 
   * @param {number} line 
   * @param {number} count 
   */
  duplicate(start: number, line: number, count: number): FileSlice;

  /**
   * Replace part of a line with given string.
   * @param {number} line - Line number of current slice.
   * @param {number} begin - Column numebr of specified line.
   * @param {number} length - Length of area to be replaced.
   * @param {string} string - String without `\n`.
   * @returns {boolean}
   */
  replaceWord(line: number, begin: number, length: number, string: string): void;

  toString(): string;
}