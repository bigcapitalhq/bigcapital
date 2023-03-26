import { Model } from 'objection';

// Bind all Models to a knex instance. If you only have one database in
// your server this is all you have to do. For multi database systems, see
// the Model.bindKnex() method.
export default ({ knex }) => {
  Model.knex(knex);
};
