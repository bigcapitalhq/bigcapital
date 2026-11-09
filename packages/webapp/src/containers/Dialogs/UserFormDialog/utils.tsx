import intl from 'react-intl-universal';

interface ResponseError {
  type: string;
}

interface TransformErrorsArgs {
  setErrors: (errors: Partial<Record<string, string>>) => void;
  setCalloutCode: (codes: number[]) => void;
}

// handle delete errors.
export const transformErrors = (
  errors: ResponseError[],
  { setErrors, setCalloutCode }: TransformErrorsArgs,
) => {
  if (
    errors.find((error) => error.type === 'CANNOT_AUTHORIZED_USER_MUTATE_ROLE')
  ) {
    setCalloutCode([200]);
    setErrors({
      roleId: intl.get('roles.error.you_cannot_change_your_own_role'),
    });
  }
};
