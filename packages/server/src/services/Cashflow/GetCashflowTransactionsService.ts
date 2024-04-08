import { ServiceError } from '@/exceptions';
import { ICashflowTransaction } from '@/interfaces';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { Inject, Service } from 'typedi';
import { CashflowTransactionTransformer } from './CashflowTransactionTransformer';
import { ERRORS } from './constants';

@Service()
export class GetCashflowTransactionService {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private transfromer: TransformerInjectable;

  /**
   * Retrieve the given cashflow transaction.
   * @param {number} tenantId
   * @param {number} cashflowTransactionId
   * @returns
   */
  public getCashflowTransaction = async (tenantId: number, cashflowTransactionId: number) => {
    const { CashflowTransaction } = this.tenancy.models(tenantId);

    const cashflowTransaction = await CashflowTransaction.query()
      .findById(cashflowTransactionId)
      .withGraphFetched('entries.cashflowAccount')
      .withGraphFetched('entries.creditAccount')
      .withGraphFetched('transactions.account')
      .orderBy('date', 'DESC')
      .throwIfNotFound();

    this.throwErrorCashflowTranscationNotFound(cashflowTransaction);

    // Transformes the cashflow transaction model to POJO.
    return this.transfromer.transform(tenantId, cashflowTransaction, new CashflowTransactionTransformer());
  };

  /**
   * Throw not found error if the given cashflow undefined.
   * @param {ICashflowTransaction} cashflowTransaction -
   */
  private throwErrorCashflowTranscationNotFound = (cashflowTransaction: ICashflowTransaction) => {
    if (!cashflowTransaction) {
      throw new ServiceError(ERRORS.CASHFLOW_TRANSACTION_NOT_FOUND);
    }
  };
}
