export class Seeder {
  knex: any;

  constructor(knex) {
    this.knex = knex;
  }
  up(_knex) {}
  down(_knex) {}
}
