import { Knex } from 'knex';
import { BillPaymentGL } from './BillPaymentGL';
import { Inject, Injectable } from '@nestjs/common';
import { LedgerStorageService } from '@/modules/Ledger/LedgerStorage.service';
import { Account } from '@/modules/Accounts/models/Account.model';
import { BillPayment } from '../models/BillPayment';
import { AccountRepository } from '@/modules/Accounts/repositories/Account.repository';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';

@Injectable()
export class BillPaymentGLEntries {
  constructor(
    private readonly ledgerStorage: LedgerStorageService,
    private readonly accountRepository: AccountRepository,
    private readonly tenancyContext: TenancyContext,

    @Inject(BillPayment.name)
    private readonly billPaymentModel: typeof BillPayment,

    @Inject(Account.name)
    private readonly accountModel: typeof Account,
  ) {}

  /**
   * Creates a bill payment GL entries.
   * @param {number} tenantId
   * @param {number} billPaymentId
   * @param {Knex.Transaction} trx
   */
  public writePaymentGLEntries = async (
    billPaymentId: number,
    trx?: Knex.Transaction,
  ): Promise<void> => {
    // Retrieves the bill payment details with associated entries.
    const payment = await this.billPaymentModel
      .query(trx)
      .findById(billPaymentId)
      .withGraphFetched('entries.bill');

    // Retrieves the given tenant metadata.
    const tenantMeta = await this.tenancyContext.getTenantMetadata();

    // Finds or creates a new A/P account of the given currency.
    const APAccount = await this.accountRepository.findOrCreateAccountsPayable(
      payment.currencyCode,
      {},
      trx,
    );
    // Exchange gain or loss account.
    const EXGainLossAccount = await this.accountModel
      .query(trx)
      .modify('findBySlug', 'exchange-grain-loss')
      .first();

    // Retrieves the bill payment ledger.
    const ledger = new BillPaymentGL(payment)
      .setAPAccountId(APAccount.id)
      .setGainLossAccountId(EXGainLossAccount.id)
      .setBaseCurrency(tenantMeta.baseCurrency)
      .getBillPaymentLedger();

    // Commits the ledger on the storage.
    await this.ledgerStorage.commit(ledger, trx);
  };

  /**
   * Rewrites the bill payment GL entries.
   * @param {number} tenantId
   * @param {number} billPaymentId
   * @param {Knex.Transaction} trx
   */
  public rewritePaymentGLEntries = async (
    billPaymentId: number,
    trx?: Knex.Transaction,
  ): Promise<void> => {
    // Revert payment GL entries.
    await this.revertPaymentGLEntries(billPaymentId, trx);

    // Write payment GL entries.
    await this.writePaymentGLEntries(billPaymentId, trx);
  };

  /**
   * Reverts the bill payment GL entries.
   * @param {number} tenantId
   * @param {number} billPaymentId
   * @param {Knex.Transaction} trx
   */
  public revertPaymentGLEntries = async (
    billPaymentId: number,
    trx?: Knex.Transaction,
  ): Promise<void> => {
    await this.ledgerStorage.deleteByReference(
      billPaymentId,
      'BillPayment',
      trx,
    );
  };
}
