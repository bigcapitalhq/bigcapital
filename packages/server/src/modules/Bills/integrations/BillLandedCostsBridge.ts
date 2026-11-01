import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';

/**
 * Item entry allocated landed cost.
 */
export interface IBillItemAllocatedCost {
  entryId: number;
  amount: number;
}

/**
 * Landed cost ledger contribution.
 */
export interface IBillLandedCostLedgerEntry {
  amount: number;
  costAccountId: number;
}

/**
 * Common landed cost entry contract.
 */
export interface IBillLandedCostEntryLike {
  id?: number;
  amount?: number;
  allocatedCostAmount?: number;
}

/**
 * Bill landed cost entry contract.
 */
export interface IBillLandedCostEntryDTO {
  itemId: number;
  landedCost?: boolean;
}

/**
 * Bill landed cost provider contract that implemented by the enterprise
 * edition.
 */
export interface IBillLandedCostsProvider {
  /**
   * Validates the given bill has no associated allocated landed costs.
   * @param {number} billId - Bill id.
   * @param {Knex.Transaction} trx - Knex transaction.
   */
  validateBillHasNoLandedCosts(
    billId: number,
    trx?: Knex.Transaction,
  ): Promise<void>;

  /**
   * Validates the bill entries that have landed cost flag should be
   * inventory items.
   * @param {IBillLandedCostEntryDTO[]} entries - Bill entries.
   */
  validateBillEntries(entries: IBillLandedCostEntryDTO[]): Promise<void>;

  /**
   * Validates the bill edit operation against associated landed costs.
   * @param {IBillLandedCostEntryLike[]} oldEntries - Old bill entries.
   * @param {IBillLandedCostEntryLike[]} newEntries - New bill entries.
   */
  validateBillEditEntries(
    oldEntries: IBillLandedCostEntryLike[],
    newEntries: IBillLandedCostEntryLike[],
  ): void;

  /**
   * Retrieves the item entries allocated landed costs of the given bill.
   * @param {number} billId - Bill id.
   * @param {Knex.Transaction} trx - Knex transaction.
   */
  getItemAllocatedCosts(
    billId: number,
    trx?: Knex.Transaction,
  ): Promise<IBillItemAllocatedCost[]>;

  /**
   * Retrieves the landed costs ledger contribution of the given bill.
   * @param {number} billId - Bill id.
   * @param {Knex.Transaction} trx - Knex transaction.
   */
  getLandedCostLedgerEntries(
    billId: number,
    trx?: Knex.Transaction,
  ): Promise<IBillLandedCostLedgerEntry[]>;
}

/**
 * Bridge between the open-source bills module and the landed cost provider.
 * The default implementation is a no-op until the enterprise edition registers
 * its provider.
 */
@Injectable()
export class BillLandedCostsBridge {
  private provider: IBillLandedCostsProvider | null = null;

  /**
   * Registers the landed cost provider.
   * @param {IBillLandedCostsProvider} provider - Landed cost provider.
   */
  public register(provider: IBillLandedCostsProvider): void {
    this.provider = provider;
  }

  /**
   * Validates the given bill has no associated allocated landed costs.
   */
  public async validateBillHasNoLandedCosts(
    billId: number,
    trx?: Knex.Transaction,
  ): Promise<void> {
    await this.provider?.validateBillHasNoLandedCosts(billId, trx);
  }

  /**
   * Validates the bill entries that have landed cost flag should be
   * inventory items.
   */
  public async validateBillEntries(
    entries: IBillLandedCostEntryDTO[],
  ): Promise<void> {
    await this.provider?.validateBillEntries(entries);
  }

  /**
   * Validates the bill edit operation against associated landed costs.
   */
  public validateBillEditEntries(
    oldEntries: IBillLandedCostEntryLike[],
    newEntries: IBillLandedCostEntryLike[],
  ): void {
    this.provider?.validateBillEditEntries(oldEntries, newEntries);
  }

  /**
   * Retrieves the item entries allocated landed costs of the given bill.
   */
  public async getItemAllocatedCosts(
    billId: number,
    trx?: Knex.Transaction,
  ): Promise<IBillItemAllocatedCost[]> {
    return this.provider?.getItemAllocatedCosts(billId, trx) ?? [];
  }

  /**
   * Retrieves the landed costs ledger contribution of the given bill.
   */
  public async getLandedCostLedgerEntries(
    billId: number,
    trx?: Knex.Transaction,
  ): Promise<IBillLandedCostLedgerEntry[]> {
    return this.provider?.getLandedCostLedgerEntries(billId, trx) ?? [];
  }
}
