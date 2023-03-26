import { Knex } from "knex";



export interface IInventoryItemCostMeta {
  itemId: number;
  valuation: number;
  quantity: number;
  average: number;
}

export interface IInventoryCostLotsGLEntriesWriteEvent {
  tenantId: number,
  startingDate: Date,
  trx: Knex.Transaction
}