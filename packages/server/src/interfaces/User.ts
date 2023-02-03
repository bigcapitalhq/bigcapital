import { AnyObject } from '@casl/ability/dist/types/types';
import { ITenant } from '@/interfaces';
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
  roleId?: number;
}

export interface IEditUserDTO {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  active: boolean;
  email: string;
  roleId: number;
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

export interface ITenantUser {}

export interface ITenantUserEditedPayload {
  tenantId: number;
  userId: number;
  editUserDTO: IEditUserDTO;
  tenantUser: ITenantUser;
  oldTenantUser: ITenantUser;
}

export interface ITenantUserActivatedPayload {
  tenantId: number;
  userId: number;
  authorizedUser: ISystemUser;
  tenantUser: ITenantUser;
}

export interface ITenantUserInactivatedPayload {
  tenantId: number;
  userId: number;
  authorizedUser: ISystemUser;
  tenantUser: ITenantUser;
}

export interface ITenantUserDeletedPayload {
  tenantId: number;
  userId: number;
  tenantUser: ITenantUser;
}

export interface ITenantUser {
  id?: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  active: boolean;
  email: string;
  roleId?: number;
  systemUserId: number;
  invitedAt: Date | null;
  inviteAcceptedAt: Date | null;
}

export interface IUserInvitedEventPayload {
  inviteToken: string;
  authorizedUser: ISystemUser;
  tenantId: number;
  user: ITenantUser;
}
export interface IUserInviteTenantSyncedEventPayload{
  invite: IUserInvite;
  authorizedUser: ISystemUser;
  tenantId: number;
  user: ITenantUser;
}

export interface IUserInviteResendEventPayload {
  inviteToken: string;
  authorizedUser: ISystemUser;
  tenantId: number;
  user: ITenantUser;
}

export interface IAcceptInviteEventPayload {
  inviteToken: IUserInvite;
  user: ISystemUser;
  inviteUserDTO: IInviteUserInput;
}

export interface ICheckInviteEventPayload {
  inviteToken: IUserInvite;
  tenant: ITenant
}

export interface IUserSendInviteDTO {
  email: string;
  roleId: number;
}