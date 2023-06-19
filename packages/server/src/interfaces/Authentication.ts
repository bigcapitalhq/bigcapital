import { ISystemUser } from './User';
import { ITenant } from './Tenancy';
import { SystemUser } from '@/system/models';

export interface IRegisterDTO {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  organizationName: string;
}

export interface ILoginDTO {
  credential: string;
  password: string;
}

export interface IPasswordReset {
  id: number;
  email: string;
  token: string;
  createdAt: Date;
}

export interface IAuthenticationService {
  signIn(
    email: string,
    password: string
  ): Promise<{ user: ISystemUser; token: string; tenant: ITenant }>;
  register(registerDTO: IRegisterDTO): Promise<ISystemUser>;
  sendResetPassword(email: string): Promise<IPasswordReset>;
  resetPassword(token: string, password: string): Promise<void>;
}

export interface IAuthSigningInEventPayload {
  email: string;
  password: string;
  user: ISystemUser;
}

export interface IAuthSignedInEventPayload {
  email: string;
  password: string;
  user: ISystemUser;
}

export interface IAuthSigningUpEventPayload {
  signupDTO: IRegisterDTO;
}

export interface IAuthSignedUpEventPayload {
  signupDTO: IRegisterDTO;
  tenant: ITenant;
  user: ISystemUser;
}

export interface IAuthSignInPOJO {
  user: ISystemUser;
  token: string;
  tenant: ITenant;
}

export interface IAuthResetedPasswordEventPayload {
  user: SystemUser;
  token: string;
  password: string;
}


export interface IAuthSendingResetPassword {
  user: ISystemUser,
  token: string;
}
export interface IAuthSendedResetPassword {
  user: ISystemUser,
  token: string;
}

export interface IAuthGetMetaPOJO  {
  signupDisabled: boolean;
}