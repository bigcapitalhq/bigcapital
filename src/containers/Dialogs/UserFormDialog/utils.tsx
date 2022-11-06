// @ts-nocheck
import intl from 'react-intl-universal';

// handle delete errors.
export const transformErrors = (errors, { setErrors, setCalloutCode }) => {
  if (
    errors.find((error) => error.type === 'CANNOT_AUTHORIZED_USER_MUTATE_ROLE')
  ) {
    setCalloutCode([200]);
    setErrors({
      role_id: intl.get('roles.error.you_cannot_change_your_own_role'),
    });
  }
};
