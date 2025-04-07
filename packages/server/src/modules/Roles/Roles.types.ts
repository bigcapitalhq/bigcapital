import { Knex } from 'knex';
import { Ability, RawRuleOf, ForcedSubject } from '@casl/ability';
import { CreateRoleDto, EditRoleDto } from './dtos/Role.dto';
import { Role } from './models/Role.model';

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
  Project = 'Project',
  TaxRate = 'TaxRate'
}

export interface IRoleCreatedPayload {
  createRoleDTO: CreateRoleDto;
  role: Role;
  trx: Knex.Transaction;
}

export interface IRoleEditedPayload {
  editRoleDTO: EditRoleDto;
  oldRole: Role;
  role: Role;
  trx: Knex.Transaction;
}

export interface IRoleDeletedPayload {
  oldRole: Role;
  roleId: number;
  trx: Knex.Transaction;
}
