import { expect } from '~/testInit';
import { Lexer } from '@/lib/LogicEvaluation/Lexer';

describe('Lexer', () => {

  it('Should retrieve tokens of the expression.', () => {
    const lexer = new Lexer('(1 && 2) || (2 || 3)');

    const tokens = lexer.getTokens();
    expect(tokens.length).equals(11);
  });
});
