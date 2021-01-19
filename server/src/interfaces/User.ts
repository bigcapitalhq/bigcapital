import { Model } from 'objection';

export interface ISystemUser extends Model {
  id: number,
  firstName: string,
  lastName: string,
  active: boolean,
  password: string,
  email: string,
  phoneNumber: string,

  roleId: number,
  tenantId: number,

  inviteAcceptAt: Date,
  lastLoginAt: Date,
  deletedAt: Date,

  createdAt: Date,
  updatedAt: Date,
}

export interface ISystemUserDTO {
  firstName: string,
  lastName: string,
  password: string,
  phoneNumber: string,
  active: boolean,
  email: string,
}

export interface IInviteUserInput {
  firstName: string,
  lastName: string,
  phoneNumber: string,
  password: string,
};

export interface IUserInvite {
  id: number,
  email: string,
  token: string,
  tenantId: number,
  createdAt?: Date,
}