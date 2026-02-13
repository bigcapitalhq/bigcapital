import { ModelObject } from 'objection';
import { TenantUser } from '../Tenancy/TenancyModels/models/TenantUser.model';
import { EditUserDto } from './dtos/EditUser.dto';
import { UserInvite } from './models/InviteUser.model';
import { SystemUser } from '../System/models/SystemUser';
import { InviteUserDto } from './dtos/InviteUser.dto';
import { TenantModel } from '../System/models/TenantModel';
import { TenantJobPayload } from '@/interfaces/Tenant';

export interface ITenantUserEditedPayload {
  userId: number;
  editUserDTO: EditUserDto;
  tenantUser: ModelObject<TenantUser>;
  oldTenantUser: ModelObject<TenantUser>;
}

export interface ITenantUserActivatedPayload {
  userId: number;
  tenantUser: ModelObject<TenantUser>;
}

export interface ITenantUserInactivatedPayload {
  userId: number;
  tenantUser: ModelObject<TenantUser>;
}

export interface ITenantUserDeletedPayload {
  userId: number;
  tenantUser: ModelObject<TenantUser>;
}

export interface IUserInvitedEventPayload {
  inviteToken: string;
  user: ModelObject<TenantUser>;
  invitingUser: ModelObject<TenantUser>;
}
export interface IUserInviteTenantSyncedEventPayload {
  invite: ModelObject<UserInvite>;
  user: ModelObject<TenantUser>;
  invitingUser: ModelObject<TenantUser>;
}

export interface IUserInviteResendEventPayload {
  inviteToken: string;
  user: ModelObject<TenantUser>;
}

export interface IAcceptInviteEventPayload {
  inviteToken: ModelObject<UserInvite>;
  user: ModelObject<SystemUser>;
  inviteUserDTO: InviteUserDto;
}

export interface ICheckInviteEventPayload {
  inviteToken: ModelObject<UserInvite>;
  tenant: ModelObject<TenantModel>;
}

export interface IUserSendInviteDTO {
  email: string;
  roleId: number;
}

export interface SendInviteUserMailJobPayload extends TenantJobPayload {
  fromUser: ModelObject<TenantUser>;
  invite: ModelObject<UserInvite>;
}
