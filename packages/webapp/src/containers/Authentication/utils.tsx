import { Intent } from '@blueprintjs/core';
import intl from 'react-intl-universal';
import * as Yup from 'yup';

export const LOGIN_ERRORS = {
  INVALID_DETAILS: 'INVALID_DETAILS',
  USER_INACTIVE: 'USER_INACTIVE',
  LOGIN_TO_MANY_ATTEMPTS: 'LOGIN_TO_MANY_ATTEMPTS',
};

const REGISTER_ERRORS = {
  PHONE_NUMBER_EXISTS: 'PHONE_NUMBER_EXISTS',
  EMAIL_EXISTS: 'EMAIL_EXISTS',
};

const SEND_RESET_PASSWORD_ERRORS = {
  EMAIL_NOT_REGISTERED: 'EMAIL_NOT_FOUND',
};

export interface AuthError {
  code?: string;
  message?: string;
}

export interface ApiErrorResponse {
  errors?: Array<{ type?: string }>;
}

export interface ToastMessage {
  message: string;
  intent: Intent;
}

export interface LoginValues {
  crediential: string;
  password: string;
  keepLoggedIn: boolean;
}

export interface RegisterValues {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export interface ResetPasswordValues {
  password: string;
  confirm_password: string;
}

export interface SendResetPasswordValues {
  crediential: string;
}

export type InviteAcceptFormValues = {
  organization_name: string;
  invited_email: string;
  first_name: string;
  last_name: string;
  password: string;
};

export const PASSWORD_MIN_LENGTH = 10;
export const PASSWORD_MAX_LENGTH = 128;

const validPassword = () =>
  Yup.string()
    .required()
    .min(PASSWORD_MIN_LENGTH)
    .max(PASSWORD_MAX_LENGTH)
    .label(intl.get('password'));

export const LoginSchema = Yup.object().shape({
  crediential: Yup.string().required().email().label(intl.get('email')),
  password: Yup.string().required().label(intl.get('password')),
});

export const RegisterSchema = Yup.object().shape({
  first_name: Yup.string().required().label(intl.get('first_name_')),
  last_name: Yup.string().required().label(intl.get('last_name_')),
  email: Yup.string().email().required().label(intl.get('email')),
  password: validPassword(),
});

export const ResetPasswordSchema = Yup.object().shape({
  password: validPassword(),
  confirm_password: Yup.string()
    .nullable()
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
  password: validPassword(),
});

export const transformSendResetPassErrorsToToasts = (
  error: AuthError,
): ToastMessage[] => {
  const toastBuilders: ToastMessage[] = [];

  if (error.code === SEND_RESET_PASSWORD_ERRORS.EMAIL_NOT_REGISTERED) {
    toastBuilders.push({
      message: intl.get('we_couldn_t_find_your_account_with_that_email'),
      intent: Intent.DANGER,
    });
  }
  return toastBuilders;
};

export const transformLoginErrorsToToasts = (
  error: AuthError,
): ToastMessage[] => {
  const toastBuilders: ToastMessage[] = [];

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

export const transformRegisterErrorsToForm = (
  errors: Array<{ type?: string }>,
): Record<string, string> => {
  const formErrors: Record<string, string> = {};

  if (errors.some((e) => e.type === REGISTER_ERRORS.EMAIL_EXISTS)) {
    formErrors.email = intl.get('the_email_already_used_in_another_account');
  }
  return formErrors;
};

export const transformRegisterToastMessages = (
  errors: Array<{ type?: string }>,
): ToastMessage[] => {
  const toastErrors: ToastMessage[] = [];

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
