import { Knex } from 'knex';
import { IItemEntry, IItemEntryDTO } from './ItemEntry';
import { IDynamicListFilterDTO } from '@/interfaces/DynamicFilter';
import { CommonMailOptions, CommonMailOptionsDTO } from './Mailable';
import { AttachmentLinkDTO } from './Attachments';
import { DiscountType } from './SaleInvoice';

export interface ISaleEstimate {
  id?: number;
  amount: number;
  currencyCode: string;
  customerId: number;
  estimateDate: Date;
  estimateNumber: string;
  reference: string;
  note: string;
  termsConditions: string;
  userId: number;
  entries: IItemEntry[];
  sendToEmail: string;
  createdAt?: Date;
  deliveredAt: string | Date;
  isConvertedToInvoice: boolean;
  isDelivered: boolean;

  branchId?: number;
  warehouseId?: number;

  total?: number;
  totalLocal?: number;

  discountAmount?: number;
  discountPercentage?: number | null;

  adjustment?: number;
}
export interface ISaleEstimateDTO {
  customerId: number;
  exchangeRate?: number;
  estimateDate?: Date;
  reference?: string;
  estimateNumber?: string;
  entries: IItemEntryDTO[];
  note: string;
  termsConditions: string;
  sendToEmail: string;
  delivered: boolean;

  branchId?: number;
  warehouseId?: number;
  attachments?: AttachmentLinkDTO[];

  // # Discount
  discount?: number;
  discountType?: DiscountType;

  // # Adjustment
  adjustment?: number;
}

export interface ISalesEstimatesFilter extends IDynamicListFilterDTO {
  stringifiedFilterRoles?: string;
  filterQuery?: (q: any) => void;
}

export interface ISalesEstimatesService {
  validateCustomerHasNoEstimates(
    tenantId: number,
    customerId: number
  ): Promise<void>;
}

export interface ISaleEstimateCreatedPayload {
  tenantId: number;
  saleEstimate: ISaleEstimate;
  saleEstimateId: number;
  saleEstimateDTO: ISaleEstimateDTO;
  trx: Knex.Transaction;
}

export interface ISaleEstimateCreatingPayload {
  estimateDTO: ISaleEstimateDTO;
  tenantId: number;
  trx: Knex.Transaction;
}

export interface ISaleEstimateEditedPayload {
  tenantId: number;
  estimateId: number;
  saleEstimate: ISaleEstimate;
  oldSaleEstimate: ISaleEstimate;
  estimateDTO: ISaleEstimateDTO;
  trx: Knex.Transaction;
}

export interface ISaleEstimateEditingPayload {
  tenantId: number;
  oldSaleEstimate: ISaleEstimate;
  estimateDTO: ISaleEstimateDTO;
  trx: Knex.Transaction;
}

export interface ISaleEstimateDeletedPayload {
  tenantId: number;
  saleEstimateId: number;
  oldSaleEstimate: ISaleEstimate;
  trx: Knex.Transaction;
}

export interface ISaleEstimateDeletingPayload {
  tenantId: number;
  oldSaleEstimate: ISaleEstimate;
  trx: Knex.Transaction;
}

export interface ISaleEstimateEventDeliveredPayload {
  tenantId: number;
  saleEstimate: ISaleEstimate;
  trx: Knex.Transaction;
}

export interface ISaleEstimateEventDeliveringPayload {
  tenantId: number;
  oldSaleEstimate: ISaleEstimate;
  trx: Knex.Transaction;
}

export enum SaleEstimateAction {
  Create = 'Create',
  Edit = 'Edit',
  Delete = 'Delete',
  View = 'View',
  NotifyBySms = 'NotifyBySms',
}

export interface ISaleEstimateApprovingEvent {
  tenantId: number;
  oldSaleEstimate: ISaleEstimate;
  trx: Knex.Transaction;
}

export interface ISaleEstimateApprovedEvent {
  tenantId: number;
  oldSaleEstimate: ISaleEstimate;
  saleEstimate: ISaleEstimate;
  trx: Knex.Transaction;
}

export interface SaleEstimateMailOptions extends CommonMailOptions {
  attachEstimate?: boolean;
}

export interface SaleEstimateMailOptionsDTO extends CommonMailOptionsDTO {
  attachEstimate?: boolean;
}

export interface ISaleEstimateMailPresendEvent {
  tenantId: number;
  saleEstimateId: number;
  messageOptions: SaleEstimateMailOptionsDTO;
}

export interface ISaleEstimateState {
  defaultTemplateId: number;
}
