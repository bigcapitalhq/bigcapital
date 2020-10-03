import { ISystemUser } from './User';
import { ITenant } from './Tenancy';

export interface IRegisterDTO {
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  organizationName: string,
};

export interface IPasswordReset {
  id: number,
  email: string,
  token: string,
  createdAt: Date,
};

export interface IAuthenticationService {
  signIn(emailOrPhone: string, password: string): Promise<{ user: ISystemUser, token: string, tenant: ITenant }>;
  register(registerDTO: IRegisterDTO): Promise<ISystemUser>;
  sendResetPassword(email: string): Promise<IPasswordReset>;
  resetPassword(token: string, password: string): Promise<void>;
}