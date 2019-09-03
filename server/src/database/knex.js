import Knex from 'knex';
import knexfile from '@/../knexfile';

const config = knexfile[process.env.NODE_ENV];
const knex = Knex(config);

export default knex;
