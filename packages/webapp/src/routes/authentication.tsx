// @ts-nocheck
import { lazy } from 'react';

const BASE_URL = '/auth';

export default [
  {
    path: `${BASE_URL}/login`,
    component: lazy(() =>
      import('@/containers/Authentication/Login').then((m) => ({
        default: m.Login,
      })),
    ),
  },
  {
    path: `${BASE_URL}/send_reset_password`,
    component: lazy(() =>
      import('@/containers/Authentication/SendResetPassword').then((m) => ({
        default: m.SendResetPassword,
      })),
    ),
  },
  {
    path: `${BASE_URL}/reset_password/:token`,
    component: lazy(() =>
      import('@/containers/Authentication/ResetPassword').then((m) => ({
        default: m.ResetPassword,
      })),
    ),
  },
  {
    path: `${BASE_URL}/invite/:token/accept`,
    component: lazy(() =>
      import('@/containers/Authentication/InviteAccept').then((m) => ({
        default: m.Invite,
      })),
    ),
  },
  {
    path: `${BASE_URL}/register/email_confirmation`,
    component: lazy(() =>
      import('@/containers/Authentication/EmailConfirmation').then((m) => ({
        default: m.EmailConfirmation,
      })),
    ),
  },
  {
    path: `${BASE_URL}/register`,
    component: lazy(() =>
      import('@/containers/Authentication/Register').then((m) => ({
        default: m.RegisterUserForm,
      })),
    ),
  },
];
