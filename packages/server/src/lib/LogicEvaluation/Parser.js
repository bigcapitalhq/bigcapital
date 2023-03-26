export const OPERATION = {
  '!': 5,
  '*': 4,
  '/': 4,
  '%': 4,
  '+': 3,
  '-': 3,
  '>': 2,
  '<': 2,
  '>=': 2,
  '<=': 2,
  '===': 2,
  '!==': 2,
  '==': 2,
  '!=': 2,
  '&&': 1,
  '||': 1,
  '?': 1,
  ':': 1,
};

// export interface Node {
//   left: Node | string | null;
//   right: Node | string | null;
//   operation: string;
//   grouped?: boolean;
// };

export default class Parser {

  constructor(token) {
    this.index = -1;
    this.blockLevel = 0;
    this.token = token;
  }

  /**
   * 
   * @return {Node | string} =- 
   */
  parse() {
    let tok;
    let root = {
      left: null,
      right: null,
      operation: null,
    };

    do {
      tok = this.parseStatement();

      if (tok === null || tok === undefined) {
        break;
      }

      if (root.left === null) {
        root.left = tok;
        root.operation = this.nextToken();

        if (!root.operation) {
          return tok;
        }

        root.right = this.parseStatement();
      } else {
        if (typeof tok !== 'string') {
          throw new Error('operation must be string, but get ' + JSON.stringify(tok));
        }
        root = this.addNode(tok, this.parseStatement(), root);
      }
    } while (tok);

    return root;
  }

  nextToken() {
    this.index += 1;
    return this.token[this.index];
  }

  prevToken() {
    return this.token[this.index - 1];
  }

  /**
   * 
   * @param {string} operation 
   * @param {Node|String|null} right 
   * @param {Node} root 
   */
  addNode(operation, right, root) {
    let pre = root;
    
    if (this.compare(pre.operation, operation) < 0 && !pre.grouped) {
      
      while (pre.right !== null &&
        typeof pre.right !== 'string' &&
        this.compare(pre.right.operation, operation) < 0 && !pre.right.grouped) {
        pre = pre.right;
      }

      pre.right = {
        operation,
        left: pre.right,
        right,
      };
      return root;
    }
    return {
      left: pre,
      right,
      operation,
    }
  }

  /**
   * 
   * @param {String} a 
   * @param {String} b 
   */
  compare(a, b) {
    if (!OPERATION.hasOwnProperty(a) || !OPERATION.hasOwnProperty(b)) {
      throw new Error(`unknow operation ${a} or ${b}`);
    }
    return OPERATION[a] - OPERATION[b];
  }

  /**
   * @return string | Node | null
   */
  parseStatement() {
    const token = this.nextToken();
    if (token === '(') {
      this.blockLevel += 1;
      const node = this.parse();
      this.blockLevel -= 1;

      if (typeof node !== 'string') {
        node.grouped = true;
      }
      return node;
    }

    if (token === ')') {
      return null;
    }

    if (token === '!') {
      return { left: null, operation: token, right: this.parseStatement() }
    }

    // 3 > -12 or -12 + 10
    if (token === '-' && (OPERATION[this.prevToken()] > 0 || this.prevToken() === undefined)) {
      return { left: '0', operation: token, right: this.parseStatement(), grouped: true };
    }

    return token;
  }
}
