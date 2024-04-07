import { systemKnexConfig } from '@/config/knexConfig';
import Knex from 'knex';
import { knexSnakeCaseMappers } from 'objection';

export default () => {
  return Knex({
    ...systemKnexConfig,
    ...knexSnakeCaseMappers({ upperCase: true }),
  });
};
