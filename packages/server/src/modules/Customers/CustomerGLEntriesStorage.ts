import { Knex } from 'knex';
import { Inject, Injectable } from '@nestjs/common';
import { LedgerStorageService } from '@/modules/Ledger/LedgerStorage.service';
import { AccountRepository } from '@/modules/Accounts/repositories/Account.repository';
import { CustomerGLEntries } from './CustomerGLEntries';
import { Customer } from './models/Customer';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class CustomerGLEntriesStorage {
  constructor(
    private readonly ledgerStorage: LedgerStorageService,
    private readonly accountRepository: AccountRepository,
    private readonly customerGLEntries: CustomerGLEntries,

    @Inject(Customer.name)
    private readonly customerModel: TenantModelProxy<typeof Customer>,
  ) { }

  /**
   * Customer opening balance journals.
   */
  public writeCustomerOpeningBalance = async (
    customerId: number,
    trx?: Knex.Transaction,
  ) => {
    const customer = await this.customerModel()
      .query(trx)
      .findById(customerId);

    // Finds the income account.
    const incomeAccount = await this.accountRepository.findOne({
      slug: 'other-income',
    });
    // Find or create the A/R account.
    const ARAccount =
      await this.accountRepository.findOrCreateAccountReceivable(
        customer.currencyCode,
        {},
        trx,
      );
    // Retrieves the customer opening balance ledger.
    const ledger = this.customerGLEntries.getCustomerOpeningLedger(
      ARAccount.id,
      incomeAccount.id,
      customer,
    );
    // Commits the ledger entries to the storage.
    await this.ledgerStorage.commit(ledger, trx);
  };

  /**
   * Reverts the customer opening balance GL entries.
   */
  public revertCustomerOpeningBalance = async (
    customerId: number,
    trx?: Knex.Transaction,
  ) => {
    await this.ledgerStorage.deleteByReference(
      customerId,
      'CustomerOpeningBalance',
      trx,
    );
  };

  /**
   * Writes the customer opening balance GL entries.
   */
  public rewriteCustomerOpeningBalance = async (
    customerId: number,
    trx?: Knex.Transaction,
  ) => {
    // Reverts the customer opening balance entries.
    await this.revertCustomerOpeningBalance(customerId, trx);

    // Write the customer opening balance entries.
    await this.writeCustomerOpeningBalance(customerId, trx);
  };
}
