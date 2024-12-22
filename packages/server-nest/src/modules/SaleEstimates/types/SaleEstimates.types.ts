import { Knex } from 'knex';
// import { CommonMailOptions, CommonMailOptionsDTO } from './Mailable';
// import { AttachmentLinkDTO } from './Attachments';
import { SaleEstimate } from '../models/SaleEstimate';
import { IItemEntryDTO } from '@/modules/TransactionItemEntry/ItemEntry.types';
import { AttachmentLinkDTO } from '@/modules/Attachments/Attachments.types';

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

// export interface ISalesEstimatesFilter extends IDynamicListFilterDTO {
//   stringifiedFilterRoles?: string;
//   filterQuery?: (q: any) => void;
// }

export interface ISaleEstimateCreatedPayload {
  // tenantId: number;
  saleEstimate: SaleEstimate;
  saleEstimateId: number;
  saleEstimateDTO: ISaleEstimateDTO;
  trx?: Knex.Transaction;
}

export interface ISaleEstimateCreatingPayload {
  estimateDTO: ISaleEstimateDTO;
  tenantId: number;
  trx: Knex.Transaction;
}

export interface ISaleEstimateEditedPayload {
  // tenantId: number;
  estimateId: number;
  saleEstimate: SaleEstimate;
  oldSaleEstimate: SaleEstimate;
  estimateDTO: ISaleEstimateDTO;
  trx?: Knex.Transaction;
}

export interface ISaleEstimateEditingPayload {
  // tenantId: number;
  oldSaleEstimate: SaleEstimate;
  estimateDTO: ISaleEstimateDTO;
  trx: Knex.Transaction;
}

export interface ISaleEstimateDeletedPayload {
  // tenantId: number;
  saleEstimateId: number;
  oldSaleEstimate: SaleEstimate;
  trx: Knex.Transaction;
}

export interface ISaleEstimateDeletingPayload {
  // tenantId: number;
  oldSaleEstimate: SaleEstimate;
  trx: Knex.Transaction;
}

export interface ISaleEstimateEventDeliveredPayload {
  // tenantId: number;
  saleEstimate: SaleEstimate;
  trx: Knex.Transaction;
}

export interface ISaleEstimateEventDeliveringPayload {
  // tenantId: number;
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
  // tenantId: number;
  oldSaleEstimate: SaleEstimate;
  trx: Knex.Transaction;
}

export interface ISaleEstimateApprovedEvent {
  // tenantId: number;
  oldSaleEstimate: SaleEstimate;
  saleEstimate: SaleEstimate;
  trx: Knex.Transaction;
}

// export interface SaleEstimateMailOptions extends CommonMailOptions {
//   attachEstimate?: boolean;
// }

// export interface SaleEstimateMailOptionsDTO extends CommonMailOptionsDTO {
//   attachEstimate?: boolean;
// }

// export interface ISaleEstimateMailPresendEvent {
//   // tenantId: number;
//   saleEstimateId: number;
//   messageOptions: SaleEstimateMailOptionsDTO;
// }

export interface ISaleEstimateState {
  defaultTemplateId: number;
}
