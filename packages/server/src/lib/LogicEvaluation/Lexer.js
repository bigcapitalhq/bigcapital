
const OperationType = {
  LOGIC: 'LOGIC',
  STRING: 'STRING',
  COMPARISON: 'COMPARISON',
  MATH: 'MATH',
};

export class Lexer {
  // operation table
  static get optable() {
    return {
      '=': OperationType.LOGIC,
      '&': OperationType.LOGIC,
      '|': OperationType.LOGIC,
      '?': OperationType.LOGIC,
      ':': OperationType.LOGIC,

      '\'': OperationType.STRING,
      '"': OperationType.STRING,

      '!': OperationType.COMPARISON,
      '>': OperationType.COMPARISON,
      '<': OperationType.COMPARISON,

      '(': OperationType.MATH,
      ')': OperationType.MATH,
      '+': OperationType.MATH,
      '-': OperationType.MATH,
      '*': OperationType.MATH,
      '/': OperationType.MATH,
      '%': OperationType.MATH,
    };
  }

  /**
   * Constructor
   * @param {*} expression -
   */
  constructor(expression) {
    this.currentIndex = 0;
    this.input = expression;
    this.tokenList = [];
  }

  getTokens() {
    let tok;
    do {
      // read current token, so step should be -1
      tok = this.pickNext(-1);
      const pos = this.currentIndex;
      switch (Lexer.optable[tok]) {
        case OperationType.LOGIC:
          // == && || ===
          this.readLogicOpt(tok);
          break;

        case OperationType.STRING:
          this.readString(tok);
          break;

        case OperationType.COMPARISON:
          this.readCompare(tok);
          break;

        case OperationType.MATH:
          this.receiveToken();
          break;

        default:
          this.readValue(tok);
      }

      // if the pos not changed, this loop will go into a infinite loop, every step of while loop,
      // we must move the pos forward
      // so here we should throw error, for example `1 & 2`
      if (pos === this.currentIndex && tok !== undefined) {
        const err = new Error(`unkonw token ${tok} from input string ${this.input}`);
        err.name = 'UnknowToken';
        throw err;
      }
    } while (tok !== undefined)

    return this.tokenList;
  }

  /**
   * read next token, the index param can set next step, default go forward 1 step
   *
   * @param index next position
   */
  pickNext(index = 0) {
    return this.input[index + this.currentIndex + 1];
  }

  /**
   * Store token into result tokenList, and move the pos index
   *
   * @param index
   */
  receiveToken(index = 1) {
    const tok = this.input.slice(this.currentIndex, this.currentIndex + index).trim();
    // skip empty string
    if (tok) {
      this.tokenList.push(tok);
    }

    this.currentIndex += index;
  }

  // ' or "
  readString(tok) {
    let next;
    let index = 0;
    do {
      next = this.pickNext(index);
      index += 1;
    } while (next !== tok && next !== undefined);
    this.receiveToken(index + 1);
  }

  // > or < or >= or <= or !==
  // tok in (>, <, !)
  readCompare(tok) {
    if (this.pickNext() !== '=') {
      this.receiveToken(1);
      return;
    }
    // !==
    if (tok === '!' && this.pickNext(1) === '=') {
      this.receiveToken(3);
      return;
    }
    this.receiveToken(2);
  }

  // === or ==
  // && ||
  readLogicOpt(tok) {
    if (this.pickNext() === tok) {
      // ===
      if (tok === '=' && this.pickNext(1) === tok) {
        return this.receiveToken(3);
      }
      // == && ||
      return this.receiveToken(2);
    }
    // handle as &&
    // a ? b : c is equal to a && b || c
    if (tok === '?' || tok === ':') {
      return this.receiveToken(1);
    }
  }

  readValue(tok) {
    if (!tok) {
      return;
    }

    let index = 0;
    while (!Lexer.optable[tok] && tok !== undefined) {
      tok = this.pickNext(index);
      index += 1;
    }
    this.receiveToken(index);
  }
}

export default function token(expression) {
  const lexer = new Lexer(expression);
  return lexer.getTokens();
}
