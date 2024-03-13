import { Service } from 'typedi';
import { ImportInsertError, ResourceMetaFieldsMap } from './interfaces';
import { convertFieldsToYupValidation } from './_utils';

@Service()
export class ImportFileDataValidator {
  /**
   * Validates the given mapped DTOs and returns errors with their index.
   * @param {Record<string, any>} mappedDTOs
   * @returns {Promise<ImportValidationError[][]>}
   */
  public async validateData(
    importableFields: ResourceMetaFieldsMap,
    data: Record<string, any>
  ): Promise<void | ImportInsertError[]> {
    const YupSchema = convertFieldsToYupValidation(importableFields);
    const _data = { ...data };

    try {
      await YupSchema.validate(_data, { abortEarly: false });
    } catch (validationError) {
      const errors = validationError.inner.map((error) => ({
        errorCode: 'ValidationError',
        errorMessage: error.errors,
      }));
      throw errors;
    }
  }
}
