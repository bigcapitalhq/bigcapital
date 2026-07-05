import { Knex } from 'knex';
import * as Yup from 'yup';
import { ImportableContext } from './interfaces';

export abstract class Importable {
  /**
   *
   * @param {number} tenantId
   * @param {any} createDTO
   * @param {Knex.Transaction} trx
   */
  public importable(createDTO: any, trx?: Knex.Transaction) {
    throw new Error(
      'The `importable` function is not defined in service importable.',
    );
  }

  /**
   * Transformes the DTO before passing it to importable and validation.
   * @param {Record<string, any>} createDTO
   * @param {ImportableContext} context
   * @returns {Record<string, any>}
   */
  public transform(createDTO: Record<string, any>, context: ImportableContext) {
    return createDTO;
  }

  /**
   * Pre-transforms the raw parsed sheet rows before column mapping and
   * validation. Receives ALL sheet columns (not only the mapped ones), so
   * importable services can normalize bank/provider-specific export formats.
   * Implementations may annotate `importFile.params` (in-memory) to signal
   * the downstream `transform()` hook.
   * @param {Record<string, unknown>[]} sheetData - Raw parsed sheet rows.
   * @param {any} importFile - The import file model.
   * @returns {Record<string, unknown>[]}
   */
  public preParseSheet(
    sheetData: Record<string, unknown>[],
    importFile?: any,
  ): Record<string, unknown>[] {
    return sheetData;
  }

  /**
   * Concurrency controlling of the importing process.
   * @returns {number}
   */
  public get concurrency() {
    return 10;
  }

  /**
   * Retrieves the sample data of importable.
   * @returns {Array<any>}
   */
  public sampleData(): Array<any> {
    return [];
  }

  // ------------------
  // # Params
  // ------------------
  /**
   * Params Yup validation schema.
   * @returns {Yup.ObjectSchema<object, object>}
   */
  public paramsValidationSchema(): Yup.ObjectSchema<object, object> {
    return Yup.object().nullable();
  }

  /**
   * Validates the params of the importable service.
   * @param {Record<string, any>}
   * @returns {Promise<boolean>} - True means passed and false failed.
   */
  public async validateParams(params: Record<string, any>): Promise<void> {}

  /**
   * Transformes the import params before storing them.
   * @param {Record<string, any>} parmas
   */
  public transformParams(parmas: Record<string, any>) {
    return parmas;
  }
}
