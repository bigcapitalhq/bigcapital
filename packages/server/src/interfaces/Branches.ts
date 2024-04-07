import { Knex } from 'knex';

export interface IBranch {
  id?: number;
}

export interface ICreateBranchDTO {
  name: string;
  code: string;

  primary?: boolean;
}
export interface IEditBranchDTO {
  code: string;
}

export interface IBranchCreatePayload {
  tenantId: number;
  createBranchDTO: ICreateBranchDTO;
  trx: Knex.Transaction;
}
export type IBranchCreatedPayload = {};

export type IBranchEditPayload = {};
export type IBranchEditedPayload = {};

export type IBranchDeletePayload = {};
export type IBranchDeletedPayload = {};

export interface IBranchesActivatePayload {
  tenantId: number;
  trx: Knex.Transaction;
}
export interface IBranchesActivatedPayload {
  tenantId: number;
  primaryBranch: IBranch;
  trx: Knex.Transaction;
}

export interface IBranchMarkAsPrimaryPayload {
  tenantId: number;
  oldBranch: IBranch;
  trx: Knex.Transaction;
}
export interface IBranchMarkedAsPrimaryPayload {
  tenantId: number;
  oldBranch: IBranch;
  markedBranch: IBranch;
  trx: Knex.Transaction;
}
