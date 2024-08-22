export class SeedDemoAbstract {
  /**
   * Retrieves the seeder file mapping.
   * @returns {Array<>}
   */
  get mapping() {
    return [];
  }

  /**
   * Retireves the seeder file import params.
   * @returns {Record<string, any>}
   */
  get importParams() {
    return {};
  }
}
