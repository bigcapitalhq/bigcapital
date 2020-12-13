import { IItemEntry } from "./ItemEntry";
import { IDynamicListFilterDTO } from 'interfaces/DynamicFilter';

export interface ISaleEstimate {
  id?: number,
  amount: number,
  customerId: number,
  estimateDate: Date,
  reference: string,
  note: string,
  termsConditions: string,
  userId: number,
  entries: IItemEntry[],
  sendToEmail: string,
  createdAt?: Date,
  deliveredAt: string|Date,
};
export interface ISaleEstimateDTO {
  customerId: number,
  estimateDate?: Date,
  reference: string,
  estimateNumber: string,
  entries: IItemEntry[],
  note: string,
  termsConditions: string,
  sendToEmail: string,
  delivered: boolean,
};

export interface ISalesEstimatesFilter extends IDynamicListFilterDTO { 
  stringifiedFilterRoles?: string,
}