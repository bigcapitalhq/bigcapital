import { AccountTransaction } from '@/modules/Accounts/models/AccountTransaction.model';
import { AccountRepository } from '@/modules/Accounts/repositories/Account.repository';
import { Contact } from '@/modules/Contacts/models/Contact';
import { Ledger } from '@/modules/Ledger/Ledger';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import { transformToMap } from '@/utils/transform-to-key';
import { Inject } from '@nestjs/common';
import { ModelObject } from 'objection';

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
  public filter: any;

  /**
   * 
   */
  public accountsGraph: any;

  /**
   * 
   */
  public contacts: Array<ModelObject<Contact>>

  /**
   * Contacts by id map.
   */
  public contactsById: Map<number, ModelObject<Contact>>;
  
  /**
   * 
   */
  public ledger: Ledger;

  public baseCurrency: string;

  setFilter(filter: any) {
    this.filter = filter;
  }

  /**
   * Loads the journal sheet data.
   */
  async load() {
    await this.initBaseCurrency();
    await this.initAccountsGraph();
    await this.initAccountTransactions();
    await this.initContacts();
    await this.initLedger();
  }

  /**
   * Initialize base currency.
   */
  async initBaseCurrency () {
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
  async initAccountTransactions() {
    // Retrieve all journal transactions based on the given query.
    const transactions = await this.accountTransaction()
      .query()
      .onBuild((query) => {
        if (this.filter.fromRange || this.filter.toRange) {
          query.modify(
            'filterAmountRange',
            this.filter.fromRange,
            this.filter.toRange,
          );
        }
        query.modify(
          'filterDateRange',
          this.filter.fromDate,
          this.filter.toDate,
        );
        query.orderBy(['date', 'createdAt', 'indexGroup', 'index']);

        if (this.filter.transactionType) {
          query.where('reference_type', this.filter.transactionType);
        }
        if (this.filter.transactionType && this.filter.transactionId) {
          query.where('reference_id', this.filter.transactionId);
        }
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

  async initLedger(){
    this.ledger = Ledger.fromTransactions(this.accountTransactions);
  }
  
}
