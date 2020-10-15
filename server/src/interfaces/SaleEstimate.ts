import { IItemEntry } from "./ItemEntry";


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

  createdAt?: Date,
};
export interface ISaleEstimateDTO {
  customerId: number,
  estimateDate?: Date,
  reference: string,
  estimateNumber: string,
  entries: IItemEntry[],
  note: string,
  termsConditions: string,
};