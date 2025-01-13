import { castArray, isEmpty } from 'lodash';
import { ServiceError } from '@/exceptions';
import { CommonMailOptions } from '@/interfaces';
import { ERRORS } from './constants';

/**
 * Merges the mail options with incoming options.
 * @param {Partial<SaleInvoiceMailOptions>} mailOptions
 * @param {Partial<SendInvoiceMailDTO>} overridedOptions
 */
export function parseMailOptions(
  mailOptions: CommonMailOptions,
  overridedOptions: Partial<CommonMailOptions>
): CommonMailOptions {
  const mergedMessageOptions = {
    ...mailOptions,
    ...overridedOptions,
  };
  const parsedMessageOptions = {
    ...mergedMessageOptions,
    from: mergedMessageOptions?.from
      ? castArray(mergedMessageOptions?.from)
      : [],
    to: mergedMessageOptions?.to ? castArray(mergedMessageOptions?.to) : [],
    cc: mergedMessageOptions?.cc ? castArray(mergedMessageOptions?.cc) : [],
    bcc: mergedMessageOptions?.bcc ? castArray(mergedMessageOptions?.bcc) : [],
  };
  return parsedMessageOptions;
}

export function validateRequiredMailOptions(
  mailOptions: Partial<CommonMailOptions>
) {
  if (isEmpty(mailOptions.from)) {
    throw new ServiceError(ERRORS.MAIL_FROM_NOT_FOUND);
  }
  if (isEmpty(mailOptions.to)) {
    throw new ServiceError(ERRORS.MAIL_TO_NOT_FOUND);
  }
  if (isEmpty(mailOptions.subject)) {
    throw new ServiceError(ERRORS.MAIL_SUBJECT_NOT_FOUND);
  }
  if (isEmpty(mailOptions.message)) {
    throw new ServiceError(ERRORS.MAIL_BODY_NOT_FOUND);
  }
}

export const mergeAndValidateMailOptions = (
  mailOptions: CommonMailOptions,
  overridedOptions: Partial<CommonMailOptions>
): CommonMailOptions => {
  const parsedMessageOptions = parseMailOptions(mailOptions, overridedOptions);
  validateRequiredMailOptions(parsedMessageOptions);

  return parsedMessageOptions;
};
