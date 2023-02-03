export class ProjectProfitabilitySummaryQuery {
  fromDate: Date;
  toDate: Date;
  projectsIds?: number[];
}

export interface IProjectProfitabilitySummaryTotal {
  amount: number;
  formattedAmount: string;
  currencyCode: string;
}

export interface IProjectProfitabilitySummaryProjectNode {
  projectId: number;
  projectName: string;
  projectStatus: any;

  customerName: string;
  customerId: number;

  income: IProjectProfitabilitySummaryTotal;
  expenses: IProjectProfitabilitySummaryTotal;

  profit: IProjectProfitabilitySummaryTotal;
}

export interface IProjectProfitabilitySummaryTotalNode {
  income: IProjectProfitabilitySummaryTotal;
  expenses: IProjectProfitabilitySummaryTotal;

  profit: IProjectProfitabilitySummaryTotal;
}

export interface IProjectProfitabilitySummaryData {
  projects: IProjectProfitabilitySummaryProjectNode[];
  total: IProjectProfitabilitySummaryTotalNode;
}

export interface IProjectProfitabilitySummaryMeta {
  organizationName: string;
  baseCurrency: string;
}

export interface IProjectProfitabilitySummaryPOJO {
  data: IProjectProfitabilitySummaryData;
  query: ProjectProfitabilitySummaryQuery;
  meta: IProjectProfitabilitySummaryMeta;
}


export enum IProjectProfitabilitySummaryRowType {
  TOTAL = 'TOTAL',
  PROJECT = 'PROJECT'
}