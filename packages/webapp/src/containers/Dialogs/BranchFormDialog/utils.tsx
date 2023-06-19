// @ts-nocheck
import intl from 'react-intl-universal';

/**
 * Transformes the response errors types.
 */
export const transformErrors = (errors, { setErrors }) => {
  if (errors.find((error) => error.type === 'BRANCH_CODE_NOT_UNIQUE')) {
    setErrors({
      code: intl.get('branch.error.warehouse_code_not_unique'),
    });
  }
};
