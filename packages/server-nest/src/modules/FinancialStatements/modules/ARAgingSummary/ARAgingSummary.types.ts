import {
  IAgingPeriod,
  IAgingSummaryQuery,
  IAgingSummaryTotal,
  IAgingSummaryContact,
  IAgingSummaryData,
  IAgingSummaryMeta,
} from '../AgingSummary/AgingSummary.types';
import { IFinancialTable } from '../../types/Table.types';

export interface IARAgingSummaryQuery extends IAgingSummaryQuery {
  customersIds: number[];
}

export interface IARAgingSummaryCustomer extends IAgingSummaryContact {
  customerName: string;
}

export interface IARAgingSummaryTotal extends IAgingSummaryTotal {}

export interface IARAgingSummaryData extends IAgingSummaryData {
  customers: IARAgingSummaryCustomer[];
}

export type IARAgingSummaryColumns = IAgingPeriod[];

export interface IARAgingSummaryMeta extends IAgingSummaryMeta {
  organizationName: string;
  baseCurrency: string;
}

export interface IARAgingSummaryTable extends IFinancialTable {
  meta: IARAgingSummaryMeta;
  query: IARAgingSummaryQuery;
}

export interface IARAgingSummarySheet {
  data: IARAgingSummaryData;
  meta: IARAgingSummaryMeta;
  query: IARAgingSummaryQuery;
  columns: IARAgingSummaryColumns;
}

