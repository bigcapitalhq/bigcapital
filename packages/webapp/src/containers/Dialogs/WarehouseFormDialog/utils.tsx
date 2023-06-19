// @ts-nocheck
import intl from 'react-intl-universal';

/**
 * Transforms the response errors types.
 */
export const transformErrors = (errors, { setErrors }) => {
  if (errors.find((error) => error.type === 'WAREHOUSE_CODE_NOT_UNIQUE')) {
    setErrors({
      code: intl.get('warehouse.error.warehouse_code_not_unique'),
    });
  }
};
