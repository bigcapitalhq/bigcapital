import { IItemEntry } from "./ItemEntry";
import { IDynamicListFilterDTO } from 'interfaces/DynamicFilter';

export interface ISaleEstimate {
  id?: number,
  amount: number,
  currencyCode: string,
  customerId: number,
  estimateDate: Date,
  estimateNumber: string,
  reference: string,
  note: string,
  termsConditions: string,
  userId: number,
  entries: IItemEntry[],
  sendToEmail: string,
  createdAt?: Date,
  deliveredAt: string|Date,
  isConvertedToInvoice: boolean
};
export interface ISaleEstimateDTO {
  customerId: number,
  estimateDate?: Date,
  reference?: string,
  estimateNumber?: string,
  entries: IItemEntry[],
  note: string,
  termsConditions: string,
  sendToEmail: string,
  delivered: boolean,
};

export interface ISalesEstimatesFilter extends IDynamicListFilterDTO { 
  stringifiedFilterRoles?: string,
}


export interface ISalesEstimatesService {
  validateCustomerHasNoEstimates(
    tenantId: number,
    customerId: number,
  ): Promise<void>;
}