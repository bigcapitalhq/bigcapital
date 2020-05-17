import Knex from 'knex';
import { knexSnakeCaseMappers } from 'objection';
import knexfile from '@/../config/systemKnexfile';

const config = knexfile[process.env.NODE_ENV];

const knex = Knex({
  ...config,
  ...knexSnakeCaseMappers({ upperCase: true }),
});

export default knex;
