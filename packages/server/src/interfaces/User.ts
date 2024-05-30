import { AnyObject } from '@casl/ability/dist/types/types';
import { ITenant } from '@/interfaces';
import { Model } from 'objection';
import { Tenant } from '@/system/models';

export interface ISystemUser extends Model {
  id: number;
  firstName: string;
  lastName: string;
  active: boolean;
  password: string;
  email: string;

  verifyToken: string;
  verified: boolean;

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
  active: boolean;
  email: string;
  roleId?: number;
}

export interface IEditUserDTO {
  firstName: string;
  lastName: string;
  active: boolean;
  email: string;
  roleId: number;
}

export interface IInviteUserInput {
  firstName: string;
  lastName: string;
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

  /**
   * Re-send user invite.
   * @param {number} tenantId -
   * @param {string} email    -
   * @return {Promise<{ invite: IUserInvite }>}
   */
  resendInvite(
    tenantId: number,
    userId: number,
    authorizedUser: ISystemUser
  ): Promise<{
    user: ITenantUser;
  }>;

  /**
   * Sends invite mail to the given email from the given tenant and user.
   * @param {number} tenantId -
   * @param {string} email -
   * @param {IUser} authorizedUser -
   * @return {Promise<IUserInvite>}
   */
  sendInvite(
    tenantId: number,
    sendInviteDTO: IUserSendInviteDTO,
    authorizedUser: ISystemUser
  ): Promise<{
    invitedUser: ITenantUser;
  }>;
}

export interface IAcceptInviteUserService {
  /**
   * Accept the received invite.
   * @param {string} token
   * @param {IInviteUserInput} inviteUserInput
   * @throws {ServiceErrors}
   * @returns {Promise<void>}
   */
  acceptInvite(token: string, inviteUserDTO: IInviteUserInput): Promise<void>;

  /**
   * Validate the given invite token.
   * @param {string} token - the given token string.
   * @throws {ServiceError}
   */
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
export interface IUserInviteTenantSyncedEventPayload {
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
  tenant: Tenant;
}

export interface IUserSendInviteDTO {
  email: string;
  roleId: number;
}
