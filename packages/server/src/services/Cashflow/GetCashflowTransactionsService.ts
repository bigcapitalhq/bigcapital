import { Service, Inject } from 'typedi';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { CashflowTransactionTransformer } from './CashflowTransactionTransformer';
import { ERRORS } from './constants';
import { ICashflowTransaction } from '@/interfaces';
import { ServiceError } from '@/exceptions';
import I18nService from '@/services/I18n/I18nService';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';

@Service()
export default class GetCashflowTransactionsService {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private i18nService: I18nService;

  @Inject()
  private transfromer: TransformerInjectable;

  /**
   * Retrieve the given cashflow transaction.
   * @param {number} tenantId
   * @param {number} cashflowTransactionId
   * @returns
   */
  public getCashflowTransaction = async (
    tenantId: number,
    cashflowTransactionId: number
  ) => {
    const { CashflowTransaction } = this.tenancy.models(tenantId);

    const cashflowTransaction = await CashflowTransaction.query()
      .findById(cashflowTransactionId)
      .withGraphFetched('entries.cashflowAccount')
      .withGraphFetched('entries.creditAccount')
      .withGraphFetched('transactions.account')
      .throwIfNotFound();

    this.throwErrorCashflowTransactionNotFound(cashflowTransaction);

    // Transformes the cashflow transaction model to POJO.
    return this.transfromer.transform(
      tenantId,
      cashflowTransaction,
      new CashflowTransactionTransformer()
    );
  };

  /**
   * Throw not found error if the given cashflow undefined.
   * @param {ICashflowTransaction} cashflowTransaction -
   */
  private throwErrorCashflowTransactionNotFound = (
    cashflowTransaction: ICashflowTransaction
  ) => {
    if (!cashflowTransaction) {
      throw new ServiceError(ERRORS.CASHFLOW_TRANSACTION_NOT_FOUND);
    }
  };
}
