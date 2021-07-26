import { Inject, Service } from 'typedi';
import { ref, transaction } from 'objection';
import {
  ILandedCostTransactionsQueryDTO,
  ILandedCostTransaction,
  IBillLandedCostTransaction,
} from 'interfaces';
import TransactionLandedCost from './TransctionLandedCost';
import BillsService from '../Bills';
import HasTenancyService from 'services/Tenancy/TenancyService';
import { formatNumber } from 'utils';

@Service()
export default class LandedCostListing {
  @Inject()
  transactionLandedCost: TransactionLandedCost;

  @Inject()
  billsService: BillsService;

  @Inject()
  tenancy: HasTenancyService;

  /**
   * Retrieve the landed costs based on the given query.
   * @param {number} tenantId
   * @param {ILandedCostTransactionsQueryDTO} query
   * @returns {Promise<ILandedCostTransaction[]>}
   */
  public getLandedCostTransactions = async (
    tenantId: number,
    query: ILandedCostTransactionsQueryDTO
  ): Promise<ILandedCostTransaction[]> => {
    const { transactionType } = query;
    const Model = this.transactionLandedCost.getModel(
      tenantId,
      query.transactionType
    );

    // Retrieve the model entities.
    const transactions = await Model.query().onBuild((q) => {
      q.where('allocated_cost_amount', '<', ref('landed_cost_amount'));

      if (query.transactionType === 'Bill') {
        q.withGraphFetched('entries.item');
      } else if (query.transactionType === 'Expense') {
        q.withGraphFetched('categories.expenseAccount');
      }
    });
    return transactions.map((transaction) => ({
      ...this.transactionLandedCost.transformToLandedCost(
        transactionType,
        transaction
      ),
    }));
  };

  /**
   * Retrieve the bill associated landed cost transactions.
   * @param {number} tenantId - Tenant id.
   * @param {number} billId - Bill id.
   * @return {Promise<IBillLandedCostTransaction>}
   */
  public getBillLandedCostTransactions = async (
    tenantId: number,
    billId: number
  ): Promise<IBillLandedCostTransaction> => {
    const { BillLandedCost } = this.tenancy.models(tenantId);

    // Retrieve the given bill id or throw not found service error.
    const bill = await this.billsService.getBillOrThrowError(tenantId, billId);

    const landedCostTransactions = await BillLandedCost.query()
      .where('bill_id', billId)
      .withGraphFetched('allocateEntries')
      .withGraphFetched('bill');

    return landedCostTransactions.map((transaction) => ({
      ...transaction.toJSON(),
      formattedAmount: formatNumber(
        transaction.amount,
        transaction.bill.currencyCode
      ),
    }));
  };
}
