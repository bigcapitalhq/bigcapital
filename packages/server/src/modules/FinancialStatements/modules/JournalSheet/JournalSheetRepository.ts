import { AccountTransaction } from '@/modules/Accounts/models/AccountTransaction.model';
import { AccountRepository } from '@/modules/Accounts/repositories/Account.repository';
import { Contact } from '@/modules/Contacts/models/Contact';
import { Ledger } from '@/modules/Ledger/Ledger';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import { transformToMap } from '@/utils/transform-to-key';
import { Inject } from '@nestjs/common';
import { ModelObject } from 'objection';
import type { IJournalReportQuery } from './JournalSheet.types';
import type { WithAccountingBasis } from '../../common/AccountingBasisService';

export class JournalSheetRepository {
  @Inject(TenancyContext)
  private tenancyContext: TenancyContext;

  @Inject(AccountRepository)
  private accountRepository: AccountRepository;

  @Inject(Contact.name)
  private contactModel: TenantModelProxy<typeof Contact>;

  @Inject(AccountTransaction.name)
  private accountTransaction: TenantModelProxy<typeof AccountTransaction>;

  @Inject(AccountTransaction.name)
  private accountTransactions: Array<ModelObject<AccountTransaction>>;

  /**
   *
   */
  public accountsGraph: any;

  /**
   *
   */
  public contacts: Array<ModelObject<Contact>>;

  /**
   * Contacts by id map.
   */
  public contactsById: Map<number, ModelObject<Contact>>;

  /**
   *
   */
  public ledger: Ledger;

  public baseCurrency: string;

  /**
   * Loads the journal sheet data.
   */
  async load(filter: WithAccountingBasis<IJournalReportQuery>) {
    await this.initBaseCurrency();
    await this.initAccountsGraph();
    await this.initAccountTransactions(filter);
    await this.initContacts();
    await this.initLedger();
  }

  /**
   * Initialize base currency.
   */
  async initBaseCurrency() {
    const metadata = await this.tenancyContext.getTenantMetadata();

    this.baseCurrency = metadata.baseCurrency;
  }

  /**
   * Initialize accounts graph.
   */
  async initAccountsGraph() {
    // Retrieve all accounts on the storage.
    const accountsGraph = await this.accountRepository.getDependencyGraph();
    this.accountsGraph = accountsGraph;
  }

  /**
   * Initialize account transactions.
   */
  async initAccountTransactions(
    filter: WithAccountingBasis<IJournalReportQuery>,
  ) {
    // Retrieve all journal transactions based on the given query.
    const transactions = await this.accountTransaction()
      .query()
      .onBuild((query) => {
        if (filter.fromRange || filter.toRange) {
          query.modify('filterAmountRange', filter.fromRange, filter.toRange);
        }
        query.modify('filterDateRange', filter.fromDate, filter.toDate);
        query.orderBy(['date', 'createdAt', 'indexGroup', 'index']);

        if (filter.transactionType) {
          query.where('reference_type', filter.transactionType);
        }
        if (filter.transactionType && filter.transactionId) {
          query.where('reference_id', filter.transactionId);
        }
        query.modify('filterByBasis', filter.basis);
        query.withGraphFetched('account');
      });
    this.accountTransactions = transactions;
  }

  /**
   * Initialize contacts.
   */
  async initContacts() {
    const contacts = await this.contactModel().query();

    this.contacts = contacts;
    this.contactsById = transformToMap(contacts, 'id');
  }

  async initLedger() {
    this.ledger = Ledger.fromTransactions(this.accountTransactions);
  }
}
