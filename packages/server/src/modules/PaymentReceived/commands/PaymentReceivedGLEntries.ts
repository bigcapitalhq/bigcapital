import { Knex } from 'knex';
import { PaymentReceivedGL } from './PaymentReceivedGL';
import { PaymentReceived } from '../models/PaymentReceived';
import { LedgerStorageService } from '@/modules/Ledger/LedgerStorage.service';
import { Ledger } from '@/modules/Ledger/Ledger';
import { AccountRepository } from '@/modules/Accounts/repositories/Account.repository';
import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import { Account } from '@/modules/Accounts/models/Account.model';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class PaymentReceivedGLEntries {
  constructor(
    private readonly ledgerStorage: LedgerStorageService,
    private readonly accountRepository: AccountRepository,
    private readonly tenancyContext: TenancyContext,

    @Inject(PaymentReceived.name)
    private readonly paymentReceivedModel: TenantModelProxy<
      typeof PaymentReceived
    >,
  ) {}

  /**
   * Writes payment GL entries to the storage.
   * @param {number} paymentReceiveId - Payment received id.
   * @param {Knex.Transaction} trx - Knex transaction.
   * @returns {Promise<void>}
   */
  public writePaymentGLEntries = async (
    paymentReceiveId: number,
    trx?: Knex.Transaction,
  ): Promise<void> => {
    // Retrieves the given tenant metadata.
    const tenantMeta = await this.tenancyContext.getTenantMetadata();

    // Retrieves the payment receive with associated entries.
    const paymentReceive = await this.paymentReceivedModel()
      .query(trx)
      .findById(paymentReceiveId)
      .withGraphFetched('entries.invoice');

    // Retrives the payment receive ledger.
    const ledger = await this.getPaymentReceiveGLedger(
      paymentReceive,
      tenantMeta.baseCurrency,
    );
    // Commit the ledger entries to the storage.
    await this.ledgerStorage.commit(ledger, trx);
  };

  /**
   * Reverts the given payment receive GL entries.
   * @param {number} paymentReceiveId - Payment received id.
   * @param {Knex.Transaction} trx - Knex transaction.
   */
  public revertPaymentGLEntries = async (
    paymentReceiveId: number,
    trx?: Knex.Transaction,
  ) => {
    await this.ledgerStorage.deleteByReference(
      paymentReceiveId,
      'PaymentReceive',
      trx,
    );
  };

  /**
   * Rewrites the given payment receive GL entries.
   * @param {number} paymentReceiveId - Payment received id.
   * @param {Knex.Transaction} trx - Knex transaction.
   */
  public rewritePaymentGLEntries = async (
    paymentReceiveId: number,
    trx?: Knex.Transaction,
  ) => {
    // Reverts the payment GL entries.
    await this.revertPaymentGLEntries(paymentReceiveId, trx);

    // Writes the payment GL entries.
    await this.writePaymentGLEntries(paymentReceiveId, trx);
  };

  /**
   * Retrieves the payment receive general ledger.
   * @param {IPaymentReceived} paymentReceive - Payment received.
   * @param {string} baseCurrencyCode - Base currency code.
   * @param {Knex.Transaction} trx - Knex transaction.
   * @returns {Ledger}
   */
  public getPaymentReceiveGLedger = async (
    paymentReceive: PaymentReceived,
    baseCurrencyCode: string,
  ): Promise<Ledger> => {
    // Retrieve the A/R account of the given currency.
    const receivableAccount =
      await this.accountRepository.findOrCreateAccountReceivable(
        paymentReceive.currencyCode,
      );
    // Exchange gain/loss account.
    const exGainLossAccount = (await this.accountRepository.findBySlug(
      'exchange-grain-loss',
    )) as Account;

    const paymentReceivedGL = new PaymentReceivedGL(paymentReceive)
      .setARAccountId(receivableAccount.id)
      .setExchangeGainOrLossAccountId(exGainLossAccount.id)
      .setBaseCurrencyCode(baseCurrencyCode);

    return paymentReceivedGL.getLedger();
  };
}
