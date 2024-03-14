import { Knex } from 'knex';

export abstract class Importable {
  /**
   *
   * @param {number} tenantId
   * @param {any} createDTO
   * @param {Knex.Transaction} trx
   */
  public importable(tenantId: number, createDTO: any, trx?: Knex.Transaction) {
    throw new Error(
      'The `importable` function is not defined in service importable.'
    );
  }

  /**
   * Concurrency controlling of the importing process.
   * @returns {number}
   */
  public get concurrency() {
    return 10;
  }
}
