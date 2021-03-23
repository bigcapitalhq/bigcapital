import { Model } from 'objection';

export interface ISystemUser extends Model {
  id: number;
  firstName: string;
  lastName: string;
  active: boolean;
  password: string;
  email: string;
  phoneNumber: string;

  roleId: number;
  tenantId: number;

  inviteAcceptAt: Date;
  lastLoginAt: Date;
  deletedAt: Date;

  createdAt: Date;
  updatedAt: Date;
}

export interface ISystemUserDTO {
  firstName: string;
  lastName: string;
  password: string;
  phoneNumber: string;
  active: boolean;
  email: string;
}

export interface IInviteUserInput {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  password: string;
}

export interface IUserInvite {
  id: number;
  email: string;
  token: string;
  tenantId: number;
  userId: number;
  createdAt?: Date;
}

export interface IInviteUserService {
  acceptInvite(token: string, inviteUserInput: IInviteUserInput): Promise<void>;
  resendInvite(
    tenantId: number,
    userId: number,
    authorizedUser: ISystemUser
  ): Promise<{
    invite: IUserInvite;
  }>;
  sendInvite(
    tenantId: number,
    email: string,
    authorizedUser: ISystemUser
  ): Promise<{
    invite: IUserInvite;
  }>;
  checkInvite(
    token: string
  ): Promise<{ inviteToken: IUserInvite; orgName: object }>;
}
