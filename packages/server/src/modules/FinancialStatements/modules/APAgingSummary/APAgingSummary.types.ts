import { IFinancialSheetCommonMeta } from '../../types/Report.types';
import { IFinancialTable } from '../../types/Table.types';
import {
  IAgingPeriod,
  IAgingSummaryQuery,
  IAgingSummaryTotal,
  IAgingSummaryContact,
  IAgingSummaryData,
} from '../AgingSummary/AgingSummary.types';
import { APAgingSummaryQueryDto } from './APAgingSummaryQuery.dto';

export interface IAPAgingSummaryVendor extends IAgingSummaryContact {
  vendorName: string;
}

export interface IAPAgingSummaryTotal extends IAgingSummaryTotal {}

export interface IAPAgingSummaryData extends IAgingSummaryData {
  vendors: IAPAgingSummaryVendor[];
}

export type IAPAgingSummaryColumns = IAgingPeriod[];

export interface IARAgingSummaryMeta extends IFinancialSheetCommonMeta {
  formattedAsDate: string;
}

export interface IAPAgingSummaryMeta extends IFinancialSheetCommonMeta {
  formattedAsDate: string;
}

export interface IAPAgingSummaryTable extends IFinancialTable {
  query: APAgingSummaryQueryDto;
  meta: IAPAgingSummaryMeta;
}

export interface IAPAgingSummarySheet {
  data: IAPAgingSummaryData;
  meta: IAPAgingSummaryMeta;
  query: APAgingSummaryQueryDto;
  columns: any;
}
