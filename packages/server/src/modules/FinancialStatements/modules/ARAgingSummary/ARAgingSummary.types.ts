import {
  IAgingPeriod,
  IAgingSummaryTotal,
  IAgingSummaryContact,
  IAgingSummaryData,
  IAgingSummaryMeta,
} from '../AgingSummary/AgingSummary.types';
import { IFinancialTable } from '../../types/Table.types';
import { ARAgingSummaryQueryDto } from './ARAgingSummaryQuery.dto';

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
  query: ARAgingSummaryQueryDto;
}

export interface IARAgingSummarySheet {
  data: IARAgingSummaryData;
  meta: IARAgingSummaryMeta;
  query: ARAgingSummaryQueryDto;
  columns: IARAgingSummaryColumns;
}
