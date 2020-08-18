import Knex from 'knex';
import { knexSnakeCaseMappers } from 'objection';
import knexfile from '@/../config/systemKnexfile';

const config = knexfile[process.env.NODE_ENV];

export default () => {
  return Knex({
    ...config,
    ...knexSnakeCaseMappers({ upperCase: true }),
  });
};