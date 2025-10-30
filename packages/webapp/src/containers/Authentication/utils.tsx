// @ts-nocheck
import * as Yup from 'yup';
import intl from 'react-intl-universal';
import { Intent } from '@blueprintjs/core';

export const LOGIN_ERRORS = {
  INVALID_DETAILS: 'INVALID_DETAILS',
  USER_INACTIVE: 'USER_INACTIVE',
  LOGIN_TO_MANY_ATTEMPTS: 'LOGIN_TO_MANY_ATTEMPTS',
};

const REGISTER_ERRORS = {
  PHONE_NUMBER_EXISTS: 'PHONE_NUMBER_EXISTS',
  EMAIL_EXISTS: 'EMAIL_EXISTS',
};

export const LoginSchema = Yup.object().shape({
  crediential: Yup.string().required().email().label(intl.get('email')),
  password: Yup.string().required().min(4).label(intl.get('password')),
});

export const RegisterSchema = Yup.object().shape({
  first_name: Yup.string().required().label(intl.get('first_name_')),
  last_name: Yup.string().required().label(intl.get('last_name_')),
  email: Yup.string().email().required().label(intl.get('email')),
  password: Yup.string().min(6).required().label(intl.get('password')),
});

export const ResetPasswordSchema = Yup.object().shape({
  password: Yup.string().min(6).required().label(intl.get('password')),
  confirm_password: Yup.string()
    .oneOf([Yup.ref('password'), null])
    .required()
    .label(intl.get('confirm_password')),
});

// Validation schema.
export const SendResetPasswordSchema = Yup.object().shape({
  crediential: Yup.string().required().email().label(intl.get('email')),
});

export const InviteAcceptSchema = Yup.object().shape({
  first_name: Yup.string().required().label(intl.get('first_name_')),
  last_name: Yup.string().required().label(intl.get('last_name_')),
  password: Yup.string().min(4).required().label(intl.get('password')),
});

export const transformSendResetPassErrorsToToasts = (error) => {
  const toastBuilders = [];

  if (error.code === ERRORS.EMAIL_NOT_REGISTERED) {
    toastBuilders.push({
      message: intl.get('we_couldn_t_find_your_account_with_that_email'),
      intent: Intent.DANGER,
    });
  }
  return toastBuilders;
};

export const transformLoginErrorsToToasts = (error) => {
  const toastBuilders = [];

  if (error.code === LOGIN_ERRORS.INVALID_DETAILS) {
    toastBuilders.push({
      message: intl.get('email_and_password_entered_did_not_match'),
      intent: Intent.DANGER,
    });
  } else if (error.code === LOGIN_ERRORS.USER_INACTIVE) {
    toastBuilders.push({
      message: intl.get('the_user_has_been_suspended_from_admin'),
      intent: Intent.DANGER,
    });
  }
  return toastBuilders;
};

export const transformRegisterErrorsToForm = (errors) => {
  const formErrors = {};

  if (errors.some((e) => e.type === REGISTER_ERRORS.EMAIL_EXISTS)) {
    formErrors.email = intl.get('the_email_already_used_in_another_account');
  }
  return formErrors;
};

export const transformRegisterToastMessages = (errors) => {
  const toastErrors = [];

  if (errors.some((e) => e.type === 'SIGNUP_RESTRICTED_NOT_ALLOWED')) {
    toastErrors.push({
      message:
        'The sign-up is restricted, the given email address is not allowed to sign-up.',
      intent: Intent.DANGER,
    });
  } else if (errors.find((e) => e.type === 'SIGNUP_RESTRICTED')) {
    toastErrors.push({
      message: 'Sign-up is disabled, and no new accounts can be created.',
      intent: Intent.DANGER,
    });
  }
  return toastErrors;
};
