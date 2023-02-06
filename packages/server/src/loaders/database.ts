import Knex from 'knex';
import { knexSnakeCaseMappers } from 'objection';
import { systemKnexConfig } from '@/config/knexConfig';

export default () => {
  return Knex({
    ...systemKnexConfig,
    ...knexSnakeCaseMappers({ upperCase: true }),
  });
};