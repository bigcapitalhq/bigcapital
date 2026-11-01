import intl from 'react-intl-universal';

interface ResponseError {
  type: string;
}

interface SetErrorsArgs {
  setErrors: (errors: Partial<Record<string, string>>) => void;
}

export const transformErrors = (
  errors: ResponseError[],
  { setErrors }: SetErrorsArgs,
) => {
  if (errors.find((error) => error.type === 'WAREHOUSE_CODE_NOT_UNIQUE')) {
    setErrors({
      code: intl.get('warehouse.error.warehouse_code_not_unique'),
    });
  }
};
