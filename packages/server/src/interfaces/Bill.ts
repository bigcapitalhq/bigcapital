import { Knex } from 'knex';
import { IDynamicListFilterDTO } from './DynamicFilter';
import { IItemEntry, IItemEntryDTO } from './ItemEntry';
import { IBillLandedCost } from './LandedCost';
import { AttachmentLinkDTO } from './Attachments';
import { DiscountType } from './SaleInvoice';

export interface IBillDTO {
  vendorId: number;
  billNumber: string;
  billDate: Date;
  dueDate: Date;
  referenceNo: string;
  status: string;
  note: string;
  amount: number;
  paymentAmount: number;
  exchangeRate?: number;
  open: boolean;
  entries: IItemEntryDTO[];
  branchId?: number;
  warehouseId?: number;
  projectId?: number;
  isInclusiveTax?: boolean;
  attachments?: AttachmentLinkDTO[];

  // # Discount
  discount?: number;
  discountType?: DiscountType;

  // # Adjustment
  adjustment?: number;
}

export interface IBillEditDTO {
  vendorId: number;
  billNumber: string;
  billDate: Date;
  dueDate: Date;
  referenceNo: string;
  status: string;
  note: string;
  amount: number;
  paymentAmount: number;
  open: boolean;
  entries: IItemEntryDTO[];

  branchId?: number;
  warehouseId?: number;
  projectId?: number;
  attachments?: AttachmentLinkDTO[];
}

export interface IBill {
  id?: number;

  vendorId: number;
  billNumber: string;
  billDate: Date;
  dueDate: Date;
  referenceNo: string;
  status: string;
  note: string;

  amount: number;
  allocatedCostAmount: number;
  landedCostAmount: number;
  unallocatedCostAmount: number;

  paymentAmount: number;
  currencyCode: string;
  exchangeRate: number;

  dueAmount: number;
  overdueDays: number;

  billableAmount: number;
  invoicedAmount: number;

  openedAt: Date | string;

  entries: IItemEntry[];

  createdAt: Date;
  updateAt: Date;

  isOpen: boolean;

  userId?: number;
  branchId?: number;
  projectId?: number;

  localAmount?: number;
  locatedLandedCosts?: IBillLandedCost[];

  amountLocal: number;
  subtotal: number;
  subtotalLocal: number;
  subtotalExcludingTax: number;
  taxAmountWithheld: number;
  taxAmountWithheldLocal: number;
  total: number;
  totalLocal: number;
}

export interface IBillsFilter extends IDynamicListFilterDTO {
  stringifiedFilterRoles?: string;
  page: number;
  pageSize: number;
  filterQuery?: (q: any) => void;
}

export interface IBillsService {
  validateVendorHasNoBills(tenantId: number, vendorId: number): Promise<void>;
}

export interface IBillCreatedPayload {
  tenantId: number;
  bill: IBill;
  billDTO: IBillDTO;
  billId: number;
  trx: Knex.Transaction;
}

export interface IBillCreatingPayload {
  tenantId: number;
  billDTO: IBillDTO;
  trx: Knex.Transaction;
}

export interface IBillEditingPayload {
  tenantId: number;
  oldBill: IBill;
  billDTO: IBillEditDTO;
  trx: Knex.Transaction;
}
export interface IBillEditedPayload {
  tenantId: number;
  billId: number;
  oldBill: IBill;
  bill: IBill;
  billDTO: IBillDTO;
  trx: Knex.Transaction;
}

export interface IBIllEventDeletedPayload {
  tenantId: number;
  billId: number;
  oldBill: IBill;
  trx: Knex.Transaction;
}

export interface IBillEventDeletingPayload {
  tenantId: number;
  oldBill: IBill;
  trx: Knex.Transaction;
}
export enum BillAction {
  Create = 'Create',
  Edit = 'Edit',
  Delete = 'Delete',
  View = 'View',
  NotifyBySms = 'NotifyBySms',
}

export interface IBillOpeningPayload {
  trx: Knex.Transaction;
  tenantId: number;
  oldBill: IBill;
}

export interface IBillOpenedPayload {
  trx: Knex.Transaction;
  bill: IBill;
  oldBill: IBill;
  tenantId: number;
}
