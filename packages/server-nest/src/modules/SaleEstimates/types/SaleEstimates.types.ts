import { Knex } from 'knex';
// import { CommonMailOptions, CommonMailOptionsDTO } from './Mailable';
// import { AttachmentLinkDTO } from './Attachments';
import { SaleEstimate } from '../models/SaleEstimate';
import { IItemEntryDTO } from '@/modules/TransactionItemEntry/ItemEntry.types';
import { AttachmentLinkDTO } from '@/modules/Attachments/Attachments.types';
import { IDynamicListFilter } from '@/modules/DynamicListing/DynamicFilter/DynamicFilter.types';
import { CommonMailOptionsDTO } from '@/modules/MailNotification/MailNotification.types';
import { CommonMailOptions } from '@/modules/MailNotification/MailNotification.types';
import { EditSaleEstimateDto } from '../dtos/SaleEstimate.dto';

export const SendSaleEstimateMailQueue = 'SendSaleEstimateMailProcessor';
export const SendSaleEstimateMailJob = 'SendSaleEstimateMailProcess';

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
}

export interface ISalesEstimatesFilter extends IDynamicListFilter {
  stringifiedFilterRoles?: string;
  filterQuery?: (q: any) => void;
}

export interface ISaleEstimateCreatedPayload {
  saleEstimate: SaleEstimate;
  saleEstimateId: number;
  saleEstimateDTO: ISaleEstimateDTO;
  trx?: Knex.Transaction;
}

export interface ISaleEstimateCreatingPayload {
  estimateDTO: ISaleEstimateDTO;
  trx: Knex.Transaction;
}

export interface ISaleEstimateEditedPayload {
  estimateId: number;
  saleEstimate: SaleEstimate;
  oldSaleEstimate: SaleEstimate;
  estimateDTO: ISaleEstimateDTO;
  trx?: Knex.Transaction;
}

export interface ISaleEstimateEditingPayload {
  oldSaleEstimate: SaleEstimate;
  estimateDTO: EditSaleEstimateDto;
  trx: Knex.Transaction;
}

export interface ISaleEstimateDeletedPayload {
  saleEstimateId: number;
  oldSaleEstimate: SaleEstimate;
  trx: Knex.Transaction;
}

export interface ISaleEstimateDeletingPayload {
  oldSaleEstimate: SaleEstimate;
  trx: Knex.Transaction;
}

export interface ISaleEstimateEventDeliveredPayload {
  saleEstimate: SaleEstimate;
  trx: Knex.Transaction;
}

export interface ISaleEstimateEventDeliveringPayload {
  oldSaleEstimate: SaleEstimate;
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
  oldSaleEstimate: SaleEstimate;
  trx: Knex.Transaction;
}

export interface ISaleEstimateApprovedEvent {
  oldSaleEstimate: SaleEstimate;
  saleEstimate: SaleEstimate;
  trx: Knex.Transaction;
}

export interface SaleEstimateMailOptions extends CommonMailOptions {
  attachEstimate?: boolean;
}

export interface SaleEstimateMailOptionsDTO extends CommonMailOptionsDTO {
  attachEstimate?: boolean;
}

export interface ISaleEstimateMailPresendEvent {
  saleEstimateId: number;
  messageOptions: SaleEstimateMailOptionsDTO;
}

export interface ISaleEstimateState {
  defaultTemplateId: number;
}

export interface ISendSaleEstimateMailProcessData {
  saleEstimateId: number;
  messageOptions: SaleEstimateMailOptionsDTO;
}
