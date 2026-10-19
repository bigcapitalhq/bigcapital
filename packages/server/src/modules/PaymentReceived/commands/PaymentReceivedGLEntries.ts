import { Knex } from 'knex';
import { PaymentReceivedAccrualGL } from './PaymentReceivedAccrualGL';
import { PaymentReceivedCashGL } from './PaymentReceivedCashGL';
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
      .withGraphFetched('entries.invoice.entries');

    // Retrives the payment receive ledger.
    const ledger = await this.getPaymentReceiveGLedger(
      paymentReceive,
      tenantMeta.baseCurrency,
      trx,
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
   * Retrieves the payment receive accrual basis ledger.
   * @param {PaymentReceived} paymentReceive - Payment received.
   * @param {string} baseCurrencyCode - Base currency code.
   * @param {Knex.Transaction} trx - Knex transaction.
   * @returns {Ledger}
   */
  public getPaymentReceiveAccrualLedger = async (
    paymentReceive: PaymentReceived,
    baseCurrencyCode: string,
    trx?: Knex.Transaction,
  ): Promise<Ledger> => {
    // Retrieve the A/R account of the given currency.
    const receivableAccount =
      await this.accountRepository.findOrCreateAccountReceivable(
        paymentReceive.currencyCode,
        {},
        trx,
      );
    // Exchange gain/loss account.
    const exGainLossAccount = (await this.accountRepository.findBySlug(
      'exchange-grain-loss',
    )) as Account;

    const paymentReceivedAccrualGL = new PaymentReceivedAccrualGL(
      paymentReceive,
    )
      .setARAccountId(receivableAccount.id)
      .setExchangeGainOrLossAccountId(exGainLossAccount.id)
      .setBaseCurrencyCode(baseCurrencyCode);

    return paymentReceivedAccrualGL.getLedger();
  };

  /**
   * Retrieves the payment receive cash basis ledger.
   * @param {PaymentReceived} paymentReceive - Payment received.
   * @param {Knex.Transaction} trx - Knex transaction.
   * @returns {Ledger}
   */
  public getPaymentReceiveCashLedger = async (
    paymentReceive: PaymentReceived,
    trx?: Knex.Transaction,
  ): Promise<Ledger> => {
    // Find or create the tax payable account.
    const taxPayableAccount =
      await this.accountRepository.findOrCreateTaxPayable({}, trx);
    // Find or create the discount expense account.
    const discountAccount =
      await this.accountRepository.findOrCreateDiscountAccount({}, trx);
    // Find or create the other charges account.
    const otherChargesAccount =
      await this.accountRepository.findOrCreateOtherChargesAccount({}, trx);

    const paymentReceivedCashGL = new PaymentReceivedCashGL(paymentReceive)
      .setTaxPayableAccountId(taxPayableAccount.id)
      .setDiscountAccountId(discountAccount.id)
      .setOtherChargesAccountId(otherChargesAccount.id);

    return paymentReceivedCashGL.getLedger();
  };

  /**
   * Retrieves the payment receive general ledger.
   * The ledger contains both the accrual basis entries (deposit/A/R)
   * and the cash basis entries (deposit/income) flagged by the basis.
   * @param {PaymentReceived} paymentReceive - Payment received.
   * @param {string} baseCurrencyCode - Base currency code.
   * @param {Knex.Transaction} trx - Knex transaction.
   * @returns {Ledger}
   */
  public getPaymentReceiveGLedger = async (
    paymentReceive: PaymentReceived,
    baseCurrencyCode: string,
    trx?: Knex.Transaction,
  ): Promise<Ledger> => {
    // Accrual basis ledger entries.
    const accrualLedger = await this.getPaymentReceiveAccrualLedger(
      paymentReceive,
      baseCurrencyCode,
      trx,
    );
    // Cash basis ledger entries.
    const cashLedger = await this.getPaymentReceiveCashLedger(
      paymentReceive,
      trx,
    );
    return new Ledger([
      ...accrualLedger.getEntries(),
      ...cashLedger.getEntries(),
    ]);
  };
}
