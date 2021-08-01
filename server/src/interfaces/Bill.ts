import { IDynamicListFilterDTO } from './DynamicFilter';
import { IItemEntry, IItemEntryDTO } from './ItemEntry';

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
  open: boolean;
  entries: IItemEntryDTO[];
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

  dueAmount: number;
  overdueDays: number;

  openedAt: Date | string;

  entries: IItemEntry[];
  userId: number;

  createdAt: Date;
  updateAt: Date;
}

export interface IBillsFilter extends IDynamicListFilterDTO {
  stringifiedFilterRoles?: string;
  page: number;
  pageSize: number;
}

export interface IBillsService {
  validateVendorHasNoBills(tenantId: number, vendorId: number): Promise<void>;
}
