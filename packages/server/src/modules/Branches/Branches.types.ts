import { Knex } from 'knex';
import { Branch } from './models/Branch.model';

export interface ICreateBranchDTO {
  name: string;
  code: string;
  primary?: boolean;
}
export interface IEditBranchDTO {
  code: string;
}

export interface IBranchCreatePayload {
  // tenantId: number;
  createBranchDTO: ICreateBranchDTO;
  trx: Knex.Transaction;
}
export type IBranchCreatedPayload = object;

export type IBranchEditPayload = object;
export type IBranchEditedPayload = object;

export type IBranchDeletePayload = object;
export type IBranchDeletedPayload = object;

export interface IBranchesActivatePayload {
  // tenantId: number;
  trx: Knex.Transaction;
}
export interface IBranchesActivatedPayload {
  // tenantId: number;
  primaryBranch: Branch;
  trx: Knex.Transaction;
}

export interface IBranchMarkAsPrimaryPayload {
  // tenantId: number;
  oldBranch: Branch;
  trx: Knex.Transaction;
}
export interface IBranchMarkedAsPrimaryPayload {
  // tenantId: number;
  oldBranch: Branch;
  markedBranch: Branch;
  trx: Knex.Transaction;
}
