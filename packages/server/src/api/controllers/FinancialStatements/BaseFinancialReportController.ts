import { query } from 'express-validator';
import BaseController from '../BaseController';

export default class BaseFinancialReportController extends BaseController {
  get sheetNumberFormatValidationSchema() {
    return [
      query('number_format.precision')
        .optional()
        .isInt({ min: 0, max: 5 })
        .toInt(),
      query('number_format.divide_on_1000').optional().isBoolean().toBoolean(),
      query('number_format.show_zero').optional().isBoolean().toBoolean(),
      query('number_format.format_money')
        .optional()
        .isIn(['total', 'always', 'none'])
        .trim(),
      query('number_format.negative_format')
        .optional()
        .isIn(['parentheses', 'mines'])
        .trim(),
    ];
  }
}
