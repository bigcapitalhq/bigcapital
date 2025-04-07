import * as moment from 'moment';

/**
 * Formats the given date fields.
 * @param {any} inputDTO - Input data.
 * @param {Array<string>} fields - Fields to format.
 * @param {string} format - Format string.
 * @returns {any}
 */
export const formatDateFields = (
  inputDTO: any,
  fields: Array<string>,
  format = 'YYYY-MM-DD',
) => {
  const _inputDTO = { ...inputDTO };

  fields.forEach((field) => {
    if (_inputDTO[field]) {
      _inputDTO[field] = moment(_inputDTO[field]).format(format);
    }
  });
  return _inputDTO;
};
