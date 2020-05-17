import { expect } from '~/testInit';
import { Lexer } from '@/lib/LogicEvaluation/Lexer';
import Parser from '@/lib/LogicEvaluation/Parser';
import QueryParser from '@/lib/LogicEvaluation/QueryParser';
import Expense from '@/models/Expense';
import knex from '@/database/knex';

describe('LoginEvaluation: Parser', () => {

  it('Should parse the logic', async () => {
    const lexer = new Lexer('(1 OR 2) AND (1 AND 3)');
    const tokens = lexer.getTokens();

    const parser = new Parser(tokens);
    const parsedTree = parser.parse();

    const queries = {
      1: (query) => {
        query.where('expense_account_id', 1);
      },
      2: (query) => {
        query.where('payment_account_id', 2);
      },
      3: (query) => {
        query.where('amount', '<', 100);
      },
    };

    const queryParser = new QueryParser(parsedTree, queries);
    const parsedQuery = queryParser.parse();

    const parsedQueryWrapper = (builder) => {
      parsedQuery(builder);
      console.log(builder.toString());
    };
    const query = await knex.select('*').from('expenses')
      .modify(parsedQueryWrapper);
 
    // console.log(query);
 
     
    // });

    // console.log(a);

    
  });

  
});