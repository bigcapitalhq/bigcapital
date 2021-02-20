import * as Yup from 'yup';
import { Intent } from '@blueprintjs/core';
import { formatMessage } from 'services/intl';

export const LOGIN_ERRORS = {
  INVALID_DETAILS: 'INVALID_DETAILS',
  USER_INACTIVE: 'USER_INACTIVE',
  LOGIN_TO_MANY_ATTEMPTS: 'LOGIN_TO_MANY_ATTEMPTS',
};

const REGISTER_ERRORS = {
  PHONE_NUMBER_EXISTS: 'PHONE_NUMBER_EXISTS',
  EMAIL_EXISTS: 'EMAIL.EXISTS',
};


export const LoginSchema = Yup.object().shape({
  crediential: Yup.string()
    .required()
    .email()
    .label(formatMessage({ id: 'email' })),
  password: Yup.string()
    .required()
    .min(4)
    .label(formatMessage({ id: 'password' })),
});

export const RegisterSchema = Yup.object().shape({
  first_name: Yup.string()
    .required()
    .label(formatMessage({ id: 'first_name_' })),
  last_name: Yup.string()
    .required()
    .label(formatMessage({ id: 'last_name_' })),
  email: Yup.string()
    .email()
    .required()
    .label(formatMessage({ id: 'email' })),
  phone_number: Yup.string()
    .matches()
    .required()
    .label(formatMessage({ id: 'phone_number_' })),
  password: Yup.string()
    .min(4)
    .required()
    .label(formatMessage({ id: 'password' })),
});

export const ResetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(4)
    .required()
    .label(formatMessage({ id: 'password' })),
  confirm_password: Yup.string()
    .oneOf([Yup.ref('password'), null])
    .required()
    .label(formatMessage({ id: 'confirm_password' })),
});

// Validation schema.
export const SendResetPasswordSchema = Yup.object().shape({
  crediential: Yup.string()
    .required()
    .email()
    .label(formatMessage({ id: 'email' })),
});

export const InviteAcceptSchema = Yup.object().shape({
  first_name: Yup.string()
    .required()
    .label(formatMessage({ id: 'first_name_' })),
  last_name: Yup.string()
    .required()
    .label(formatMessage({ id: 'last_name_' })),
  phone_number: Yup.string()
    .matches()
    .required()
    .label(formatMessage({ id: 'phone_number' })),
  password: Yup.string()
    .min(4)
    .required()
    .label(formatMessage({ id: 'password' })),
});

export const transformSendResetPassErrorsToToasts = (errors) => {
  const toastBuilders = [];

  if (errors.find((e) => e.type === 'EMAIL.NOT.REGISTERED')) {
    toastBuilders.push({
      message: formatMessage({
        id: 'we_couldn_t_find_your_account_with_that_email',
      }),
      intent: Intent.DANGER,
    });
  }
  return toastBuilders;
}

export const transformLoginErrorsToToasts = (errors) => {
  const toastBuilders = [];

  if (errors.find((e) => e.type === LOGIN_ERRORS.INVALID_DETAILS)) {
    toastBuilders.push({
      message: formatMessage({
        id: 'email_and_password_entered_did_not_match',
      }),
      intent: Intent.DANGER,
    });
  }
  if (errors.find((e) => e.type === LOGIN_ERRORS.USER_INACTIVE)) {
    toastBuilders.push({
      message: formatMessage({
        id: 'the_user_has_been_suspended_from_admin',
      }),
      intent: Intent.DANGER,
    });
  }
  if (
    errors.find((e) => e.type === LOGIN_ERRORS.LOGIN_TO_MANY_ATTEMPTS)
  ) {
    toastBuilders.push({
      message: formatMessage({
        id: 'your_account_has_been_locked',
      }),
      intent: Intent.DANGER,
    });
  }
  return toastBuilders;
}

export const transformRegisterErrorsToForm = (errors) => {
  const formErrors = {};

  if (errors.some((e) => e.type === REGISTER_ERRORS.PHONE_NUMBER_EXISTS)) {
    formErrors.phone_number = formatMessage({
      id: 'the_phone_number_already_used_in_another_account',
    });
  }
  if (errors.some((e) => e.type === REGISTER_ERRORS.EMAIL_EXISTS)) {
    formErrors.email = formatMessage({
      id: 'the_email_already_used_in_another_account',
    });
  }
  return formErrors;
}