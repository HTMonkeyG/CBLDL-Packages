const pl = require("path")
  , { PreprocessLexer, PreprocessToken, PreprocessTokenContent } = require("./lexer.js")
  , { PreprocessContext, BuiltinPreprocessError } = require("./errors.js")
  , { FileInterface, FileSlice } = require("hlcl-mediate");

/**
 * Discard comments and replace them with an equal number of blank lines.
 * @param {FileSlice} file - Input file.
 * @returns {FileSlice}
 */
function discardComment(file) {
  var input = file.getContent()
    , cursor = 0
    , state = 0
    , line = ""
    , string = ""
    , result = FileSlice.copy(file);

  // Normalize line feed to LF.
  input = input.replace(/\r\n/g, "\n");
  // Replace single line comments.
  input = input.replace(/\/\/.*\r?\n/g, "\n");

  // Replace block comments to empty lines.
  while (cursor < input.length) {
    if (!state && input[cursor] == "/" && input[cursor + 1] == "*") {
      state = 1;
      line = "";
      cursor++;
    } else if (state == 1) {
      if (input[cursor] == "\n")
        line += "\n";
      else if (input[cursor] == "*" && input[cursor + 1] == "/") {
        state = 0;
        string += line;
        cursor++;
      }
    } else if (!state)
      string += input[cursor];
    cursor++;
  }

  result.content = string.split("\n");

  return result
}

/**
 * Process `#include` statement, combine the included files to a single
 * `FileSlice` object.
 * @param {FileSlice} input - Input content processed by `discardComment()`.
 * @param {string[]} paths - Include paths.
 * @param {FileInterface} fileInterface - File accessor.
 * @param {number} nesting - Nesting count.
 * @returns
 */
function processInclude(input, paths, fileInterface, nesting) {
  function move() {
    look = lexer.scan()
  }

  function lookForFile(f) {
    // Find given file through FileInterface.
    for (var p of paths) {
      p = pl.join(p, f);
      if (!fileInterface.existSync(p))
        continue;
      return p
    }
    return void 0
  }

  function seek(f) {
    for (; ; f = f.next)
      if (!f.next)
        return f
  }

  var lexer = new PreprocessLexer(input)
    // The processed FileSlice chain.
    , result = FileSlice.copy(input)
    // The FileSlice contains the remain part of input file.
    , remain = result
    , errors = []
    , look, last, filePath, foundFile, file
    , combineResult, e;

  nesting = nesting || 0;
  paths.unshift("./");
  for (move(); look; move()) {
    // Preprocess statement must be the first token of a line.
    if (look.content != PreprocessTokenContent.Reserved.HASH_INCLUDE || !look.first)
      continue;

    // Restore the `#include` token, and scan next token.
    last = look;
    move();

    // File name and `#include` must in the same line.
    if (look.content.type != PreprocessTokenContent.Type.STRING) {
      // Encountered unexpected token, skip current line.
      errors.push(BuiltinPreprocessError.UNEXPECTED.create(new PreprocessContext(look, lexer), look));
      lexer.skipLine();
      continue
    } else if (look.line != last.line) {
      errors.push(BuiltinPreprocessError.UNEXPECTED_LF.create(new PreprocessContext(look, lexer)));
      continue
    }

    // Remove the quotes.
    filePath = look.content.content.slice(1, look.content.content.length - 1);
    // Find the included file in the paths.
    foundFile = lookForFile(filePath);

    if (nesting > 15) {
      // If nesting overflowed, instantly stop processing.
      errors.push(BuiltinPreprocessError.NESTING_OVF.create(new PreprocessContext(last, lexer)));
      break
    }
    if (!foundFile) {
      // If file not found, skip this `#include`.
      errors.push(BuiltinPreprocessError.NOT_FOUND.create(new PreprocessContext(look, lexer), filePath));
      continue
    }

    // Replace `#include` statement with the given file.
    remain.clear(look.line - remain.parentLine);
    file = discardComment(FileSlice.fromFile(filePath, fileInterface.readFileSync(foundFile)));
    combineResult = processInclude(file, paths, fileInterface, nesting + 1);

    // Insert the included file to the input.
    remain.insert(
      // Insert after the empty line replaced `#include`.
      look.line + 1 - remain.parentLine,
      combineResult.value
    );
    errors = errors.concat(combineResult.errors);
    e = combineResult.errors.at(-1);
    if (e && e.type == BuiltinPreprocessError.NESTING_OVF)
      // If the nesting overflow is firstly thrown in the file just processed,
      // it will be the last error in the array. We need to instantly stop
      // processing when the overflow is encountered.
      break;
    // After the insert operation, the remain part will be pushed to the last
    // FileSlice in the chain. So we need to seek to the remain part.
    remain = seek(remain);
  }

  return {
    value: result,
    errors: errors
  }
}

/**
 * Process `#dup` statement.
 * @param {FileSlice} input 
 * @param {number} nesting 
 */
function processDuplicate(input, nesting) {

}

class PreprocessMacro {
  constructor() {

  }
}

class PreprocessParser {
  static discardComment = discardComment;
  static processInclude = processInclude;
  static processDuplicate = processDuplicate;

  /**
   * @param {FileSlice} fileSlice 
   * @param {Map<string, any>} macros 
   * @param {string[]} includePaths 
   * @param {FileInterface} fileInterface 
   */
  constructor(fileSlice, macros, includePaths, fileInterface) {
    var combined = processInclude(discardComment(fileSlice), includePaths, fileInterface);

    this.input = discardComment(fileSlice);
    this.result = FileSlice.copy(this.input)
    this.lexer = new PreprocessLexer(this.input);
    this.look = null;
    this.includes = [];
    this.errors = combined.errors || [];
    this.warnings = [];
    this.macros = macros || new Map();
    this.done = false;

    this.move();
  }

  /**
   * Scan the next token.
   * @returns {PreprocessToken}
   */
  move() {
    this.look = this.lexer.scan();
    return this.look
  }

  /**
   * Check if the current token matches the given token.
   * @param {PreprocessToken} [t] - Token to be matched.
   * @returns {boolean}
   */
  match(t) {
    if (this.look.content == t) {
      this.move();
      return true
    } else {
      this.errors.push(BuiltinPreprocessError.UNEXPECTED.create(new PreprocessContext(look, lexer), look));
      return false
    }
  }

  parseDefineContent() {

  }

  /**
   * 
   * @returns 
   */
  parseDefineParams() {
    var result = [];
    if (this.look.type == PreprocessTokenContent.Type.TOKEN && this.look.content == "(") {

    } else {
      while (!this.look.first) {
        result.push(this.look);
        this.move();
      }
    }

    return result
  }

  parseDefine(undef) {
    // `#define` and `#undef` statement.
    var last = this.look;

    this.move();
    if (!PreprocessToken.isSameLine(last, this.look)) {
      this.move();
      this.errors.push(BuiltinPreprocessError.NO_MACRO_NAME.create(
        new PreprocessContext(last, this.lexer)
      ));
      return false
    }

    if (this.look.content.type != PreprocessTokenContent.Type.WORD) {
      this.move();
      this.errors.push(BuiltinPreprocessError.INVALID_MACRO_NAME.create(
        new PreprocessContext(this.look, this.lexer)
      ));
      return false
    }

    last = this.look;
    this.result.clear(last.line - this.result.parentLine);

    if (undef)
      this.macros.delete(last.getRaw());
    else {
      this.move();
      this.macros.set(last.getRaw(), this.parseDefineParams());
    }

    return true
  }

  /**
   * Expand a macro with current token.
   */
  macroExpansion() {
    if (this.macros.has(this.look.getRaw())) {
      this.result.replaceWord(
        this.look.line - this.result.parentLine,
        this.look.column,
        this.look.getRaw().length,
        this.macros.get(this.look.getRaw()).toString()
      );
    }
  }

  /**
   * Preprocess the whole file.
   */
  parse() {
    while (this.look) {
      if (this.look.first) {
        if (this.look.content == PreprocessTokenContent.Reserved.HASH_DEFINE) {
          if (!this.parseDefine(false))
            continue;
        } else if (this.look.content == PreprocessTokenContent.Reserved.HASH_UNDEF) {
          if (!this.parseDefine(true))
            continue;
        } else if (this.look.content == PreprocessTokenContent.Reserved.HASH_INCLUDE) {

        }
      }

      if (this.look.content.type == PreprocessTokenContent.Type.WORD)
        this.macroExpansion();

      this.move();
    }
  }
}

module.exports = PreprocessParser;