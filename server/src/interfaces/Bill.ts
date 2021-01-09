import { IDynamicListFilterDTO } from "./DynamicFilter";
import { IItemEntry, IItemEntryDTO } from "./ItemEntry";

export interface IBillDTO {
  vendorId: number,
  billNumber: string,
  billDate: Date,
  dueDate: Date,
  referenceNo: string,
  status: string,
  note: string,
  amount: number,
  paymentAmount: number,
  open: boolean,
  entries: IItemEntryDTO[],
};

export interface IBillEditDTO {
  vendorId: number,
  billNumber: string,
  billDate: Date,
  dueDate: Date,
  referenceNo: string,
  status: string,
  note: string,
  amount: number,
  paymentAmount: number,
  open: boolean,
  entries: IItemEntryDTO[],
};

export interface IBill {
  id?: number,

  vendorId: number,
  billNumber: string,
  billDate: Date,
  dueDate: Date,
  referenceNo: string,
  status: string,
  note: string,
  amount: number,
  paymentAmount: number,

  dueAmount: number,
  overdueDays: number,

  invLotNumber: string,
  openedAt: Date | string,

  entries: IItemEntry[],
  userId: number,
};

export interface IBillsFilter extends IDynamicListFilterDTO { 
  stringifiedFilterRoles?: string,
}