import { isEmpty } from 'lodash';
import { ServiceError } from '@/exceptions';
import { CommonMailOptions, CommonMailOptionsDTO } from '@/interfaces';
import { ERRORS } from './constants';

/**
 * Merges the mail options with incoming options.
 * @param {Partial<SaleInvoiceMailOptions>} mailOptions
 * @param {Partial<SendInvoiceMailDTO>} overridedOptions
 * @throws {ServiceError}
 */
export function parseAndValidateMailOptions(
  mailOptions: Partial<CommonMailOptions>,
  overridedOptions: Partial<CommonMailOptionsDTO>
) {
  const mergedMessageOptions = {
    ...mailOptions,
    ...overridedOptions,
  };
  if (isEmpty(mergedMessageOptions.from)) {
    throw new ServiceError(ERRORS.MAIL_FROM_NOT_FOUND);
  }
  if (isEmpty(mergedMessageOptions.to)) {
    throw new ServiceError(ERRORS.MAIL_TO_NOT_FOUND);
  }
  if (isEmpty(mergedMessageOptions.subject)) {
    throw new ServiceError(ERRORS.MAIL_SUBJECT_NOT_FOUND);
  }
  if (isEmpty(mergedMessageOptions.body)) {
    throw new ServiceError(ERRORS.MAIL_BODY_NOT_FOUND);
  }
  return mergedMessageOptions;
}
