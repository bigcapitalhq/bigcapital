import { Ability, RawRuleOf, ForcedSubject } from '@casl/ability';
import Knex from 'knex';

export const actions = [
  'manage',
  'create',
  'read',
  'update',
  'delete',
] as const;
export const subjects = ['Article', 'all'] as const;

export type Abilities = [
  typeof actions[number],
  (
    | typeof subjects[number]
    | ForcedSubject<Exclude<typeof subjects[number], 'all'>>
  )
];

export type AppAbility = Ability<Abilities>;

export const createAbility = (rules: RawRuleOf<AppAbility>[]) =>
  new Ability<Abilities>(rules);

export interface IRoleDTO {
  roleName: string;
  roleDescription: string;
  permissions: ICreateRolePermissionDTO[];
}

export interface IEditRoleDTO extends IRoleDTO {
  permissions: IEditRolePermissionDTO[];
}

export interface IRolePermissionDTO {
  subject: string;
  ability: string;
  value: boolean;
}

export interface ICreateRolePermissionDTO extends IRolePermissionDTO {}
export interface IEditRolePermissionDTO extends IRolePermissionDTO {
  permissionId: number;
}

export interface ICreateRoleDTO extends IRoleDTO {}

export interface ISubjectAbilitySchema {
  key: string;
  label: string;
  default?: boolean;
}

export interface ISubjectAbilitiesSchema {
  subject: string;
  subjectLabel: string;
  description?: string;
  abilities?: ISubjectAbilitySchema[];
  extraAbilities?: ISubjectAbilitySchema[];
}

export interface IRole {
  id?: number;
  name: string;
  slug: string;
  description: string;
  predefined: boolean;
  permissions?: IRolePermission[];
}

export interface IRolePermission {
  id?: number;
  roleId?: number;
  subject: string;
  ability: string;
  value: boolean;
}

export enum AbilitySubject {
  Item = 'Item',
  InventoryAdjustment = 'InventoryAdjustment',
  Report = 'Report',
  Account = 'Account',
  SaleInvoice = 'SaleInvoice',
  SaleEstimate = 'SaleEstimate',
  SaleReceipt = 'SaleReceipt',
  PaymentReceive = 'PaymentReceive',
  Bill = 'Bill',
  PaymentMade = 'PaymentMade',
  Expense = 'Expense',
  Customer = 'Customer',
  Vendor = 'Vendor',
  Cashflow = 'Cashflow',
  ManualJournal = 'ManualJournal',
  Preferences = 'Preferences',
  CreditNote = 'CreditNode',
  VendorCredit = 'VendorCredit',
  Project = 'Project'
}

export interface IRoleCreatedPayload {
  tenantId: number;
  createRoleDTO: ICreateRoleDTO;
  role: IRole;
  trx: Knex.Transaction;
}

export interface IRoleEditedPayload {
  editRoleDTO: IEditRoleDTO;
  oldRole: IRole;
  role: IRole;
  trx: Knex.Transaction;
}

export interface IRoleDeletedPayload {
  oldRole: IRole;
  roleId: number;
  tenantId: number;
  trx: Knex.Transaction;
}
