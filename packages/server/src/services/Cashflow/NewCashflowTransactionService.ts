import { Service, Inject } from 'typedi';
import { isEmpty, pick } from 'lodash';
import { Knex } from 'knex';
import * as R from 'ramda';
import {
  ICashflowNewCommandDTO,
  ICashflowTransaction,
  ICashflowTransactionLine,
  ICommandCashflowCreatedPayload,
  ICommandCashflowCreatingPayload,
  ICashflowTransactionInput,
  IAccount,
} from '@/interfaces';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { CASHFLOW_TRANSACTION_TYPE } from './constants';
import { transformCashflowTransactionType } from './utils';
import events from '@/subscribers/events';
import { CommandCashflowValidator } from './CommandCashflowValidator';
import UnitOfWork from '@/services/UnitOfWork';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import { CashflowTransactionAutoIncrement } from './CashflowTransactionAutoIncrement';
import { BranchTransactionDTOTransform } from '@/services/Branches/Integrations/BranchTransactionDTOTransform';

@Service()
export default class NewCashflowTransactionService {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private validator: CommandCashflowValidator;

  @Inject()
  private uow: UnitOfWork;

  @Inject()
  private eventPublisher: EventPublisher;

  @Inject()
  private autoIncrement: CashflowTransactionAutoIncrement;

  @Inject()
  private branchDTOTransform: BranchTransactionDTOTransform;

  /**
   * Authorize the cashflow creating transaction.
   * @param {number} tenantId
   * @param {ICashflowNewCommandDTO} newCashflowTransactionDTO
   */
  public authorize = async (
    tenantId: number,
    newCashflowTransactionDTO: ICashflowNewCommandDTO,
    creditAccount: IAccount
  ) => {
    const transactionType = transformCashflowTransactionType(
      newCashflowTransactionDTO.transactionType
    );
    // Validates the cashflow transaction type.
    this.validator.validateCashflowTransactionType(transactionType);

    // Retrieve accounts of the cashflow lines object.
    this.validator.validateCreditAccountWithCashflowType(
      creditAccount,
      transactionType as CASHFLOW_TRANSACTION_TYPE
    );
  };

  /**
   * Transformes owner contribution DTO to cashflow transaction.
   * @param {ICashflowNewCommandDTO} newCashflowTransactionDTO - New transaction DTO.
   * @returns {ICashflowTransaction} - Cashflow transaction object.
   */
  private transformCashflowTransactionDTO = (
    tenantId: number,
    newCashflowTransactionDTO: ICashflowNewCommandDTO,
    cashflowAccount: IAccount,
    userId: number
  ): ICashflowTransactionInput => {
    const amount = newCashflowTransactionDTO.amount;

    const fromDTO = pick(newCashflowTransactionDTO, [
      'date',
      'referenceNo',
      'description',
      'transactionType',
      'exchangeRate',
      'cashflowAccountId',
      'creditAccountId',
      'branchId',
    ]);
    // Retreive the next invoice number.
    const autoNextNumber =
      this.autoIncrement.getNextTransactionNumber(tenantId);

    // Retrieve the transaction number.
    const transactionNumber =
      newCashflowTransactionDTO.transactionNumber || autoNextNumber;

    const initialDTO = {
      amount,
      ...fromDTO,
      transactionNumber,
      currencyCode: cashflowAccount.currencyCode,
      transactionType: transformCashflowTransactionType(
        fromDTO.transactionType
      ),
      userId,
      ...(newCashflowTransactionDTO.publish
        ? {
            publishedAt: new Date(),
          }
        : {}),
    };
    return R.compose(
      this.branchDTOTransform.transformDTO<ICashflowTransactionInput>(tenantId)
    )(initialDTO);
  };

  /**
   * Owner contribution money in.
   * @param {number} tenantId -
   * @param {ICashflowOwnerContributionDTO} ownerContributionDTO
   * @param {number} userId - User id.
   */
  public newCashflowTransaction = async (
    tenantId: number,
    newTransactionDTO: ICashflowNewCommandDTO,
    userId: number
  ): Promise<{ cashflowTransaction: ICashflowTransaction }> => {
    const { CashflowTransaction, Account } = this.tenancy.models(tenantId);

    // Retrieves the cashflow account or throw not found error.
    const cashflowAccount = await Account.query()
      .findById(newTransactionDTO.cashflowAccountId)
      .throwIfNotFound();

    // Retrieves the credit account or throw not found error.
    const creditAccount = await Account.query()
      .findById(newTransactionDTO.creditAccountId)
      .throwIfNotFound();

    // Authorize before creating cashflow transaction.
    await this.authorize(tenantId, newTransactionDTO, creditAccount);

    // Transformes owner contribution DTO to cashflow transaction.
    const cashflowTransactionObj = this.transformCashflowTransactionDTO(
      tenantId,
      newTransactionDTO,
      cashflowAccount,
      userId
    );
    // Creates a new cashflow transaction under UOW environment.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onCashflowTransactionCreate` event.
      await this.eventPublisher.emitAsync(
        events.cashflow.onTransactionCreating,
        {
          trx,
          tenantId,
          newTransactionDTO,
        } as ICommandCashflowCreatingPayload
      );
      // Inserts cashflow owner contribution transaction.
      const cashflowTransaction = await CashflowTransaction.query(
        trx
      ).upsertGraph(cashflowTransactionObj);

      // Triggers `onCashflowTransactionCreated` event.
      await this.eventPublisher.emitAsync(
        events.cashflow.onTransactionCreated,
        {
          tenantId,
          newTransactionDTO,
          cashflowTransaction,
          trx,
        } as ICommandCashflowCreatedPayload
      );
      return { cashflowTransaction };
    });
  };
}
