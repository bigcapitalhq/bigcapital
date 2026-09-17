import request = require('supertest');
import { app } from '../init-app-test';
import { authHeaders } from './gl';

/**
 * Cash flow statement e2e helpers that read the report through
 * `GET /reports/cashflow-statement` in both the JSON and table formats.
 */

export interface CashFlowQuery {
  fromDate?: string;
  toDate?: string;
  displayColumnsType?: 'total' | 'date_periods';
  displayColumnsBy?: string;
  noneZero?: boolean;
  noneTransactions?: boolean;
}

export interface CashFlowNode {
  id: string | number;
  label?: string;
  section_type?: string;
  total: { amount: number; formatted_amount?: string; currency_code?: string };
  periods?: any[];
  children?: CashFlowNode[];
  [key: string]: any;
}

export interface CashFlowRow {
  id: string | number;
  row_types: string[];
  cells: { key: string; value: string }[];
}

export interface CashFlowTable {
  columns: { key: string; label: string }[];
  rows: CashFlowRow[];
}

const withDefaults = (query: CashFlowQuery) => ({
  fromDate: '2023-01-01',
  toDate: '2023-12-31',
  ...query,
});

/**
 * Retrieves the cash flow statement (JSON sheet format).
 */
export const fetchCashFlowStatement = async (
  query: CashFlowQuery = {},
): Promise<{ data: CashFlowNode[]; query: any; meta: any }> => {
  const res = await request(app.getHttpServer())
    .get('/reports/cashflow-statement')
    .query(withDefaults(query))
    .set(authHeaders())
    .expect(200);

  return res.body;
};

/**
 * Retrieves the cash flow statement (JSON table format).
 */
export const fetchCashFlowTable = async (
  query: CashFlowQuery = {},
): Promise<{ table: CashFlowTable; query: any; meta: any }> => {
  const res = await request(app.getHttpServer())
    .get('/reports/cashflow-statement')
    .query(withDefaults(query))
    .set({ ...authHeaders(), Accept: 'application/json+table' })
    .expect(200);

  return res.body;
};

/**
 * Deeply searches the report nodes by node id.
 */
export const findCashFlowNode = (
  nodes: CashFlowNode[],
  id: string | number,
): CashFlowNode | undefined => {
  for (const node of nodes ?? []) {
    if (node.id === id) return node;
    const found = findCashFlowNode(node.children ?? [], id);
    if (found) return found;
  }
  return undefined;
};

/**
 * Searches the table rows by row id.
 */
export const findCashFlowRow = (
  rows: CashFlowRow[],
  id: string | number,
): CashFlowRow | undefined => (rows ?? []).find((row) => row.id === id);
