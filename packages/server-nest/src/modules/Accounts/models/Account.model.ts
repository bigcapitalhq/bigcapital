/* eslint-disable global-require */
// import { mixin, Model } from 'objection';
import { castArray } from 'lodash';
import DependencyGraph from '@/libs/dependency-graph';
import {
  ACCOUNT_TYPES,
  getAccountsSupportsMultiCurrency,
} from '@/constants/accounts';
import { TenantModel } from '@/modules/System/models/TenantModel';
// import { SearchableModel } from '@/modules/Search/SearchableMdel';
// import { CustomViewBaseModel } from '@/modules/CustomViews/CustomViewBaseModel';
// import { ModelSettings } from '@/modules/Settings/ModelSettings';
import { AccountTypesUtils } from '@/libs/accounts-utils/AccountTypesUtils';
import { Model } from 'objection';
import { PlaidItem } from '@/modules/BankingPlaid/models/PlaidItem';
import { TenantBaseModel } from '@/modules/System/models/TenantBaseModel';
import { flatToNestedArray } from '@/utils/flat-to-nested-array';
// import AccountSettings from './Account.Settings';
// import { DEFAULT_VIEWS } from '@/modules/Accounts/constants';
// import { buildFilterQuery, buildSortColumnQuery } from '@/lib/ViewRolesBuilder';
// import { flatToNestedArray } from 'utils';


export class Account extends TenantBaseModel {
  public name!: string;
  public slug!: string;
  public code!: string;
  public index!: number;
  public accountType!: string;
  public parentAccountId!: number | null;
  public predefined!: boolean;
  public currencyCode!: string;
  public active!: boolean;
  public bankBalance!: number;
  public lastFeedsUpdatedAt!: string | Date | null;
  public amount!: number;
  public plaidItemId!: string;
  public plaidAccountId!: string | null;
  public isFeedsActive!: boolean;
  public isSyncingOwner!: boolean;
  public plaidItem!: PlaidItem;

  /**
   * Table name.
   */
  static get tableName() {
    return 'accounts';
  }

  /**
   * Timestamps columns.
   */
  static get timestamps() {
    return ['createdAt', 'updatedAt'];
  }

  /**
   * Virtual attributes.
   */
  static get virtualAttributes() {
    return [
      'accountTypeLabel',
      'accountParentType',
      'accountRootType',
      'accountNormal',
      'accountNormalFormatted',
      'isBalanceSheetAccount',
      'isPLSheet',
    ];
  }

  /**
   * Account normal.
   */
  get accountNormal(): string {
    return AccountTypesUtils.getType(this.accountType, 'normal');
  }

  get accountNormalFormatted(): string {
    const paris = {
      credit: 'Credit',
      debit: 'Debit',
    };
    return paris[this.accountNormal] || '';
  }

  /**
   * Retrieve account type label.
   */
  get accountTypeLabel(): string {
    return AccountTypesUtils.getType(this.accountType, 'label');
  }

  /**
   * Retrieve account parent type.
   */
  get accountParentType(): string {
    return AccountTypesUtils.getType(this.accountType, 'parentType');
  }

  /**
   * Retrieve account root type.
   */
  get accountRootType(): string {
    return AccountTypesUtils.getType(this.accountType, 'rootType');
  }

  /**
   * Retrieve whether the account is balance sheet account.
   */
  get isBalanceSheetAccount(): boolean {
    return this.isBalanceSheet();
  }

  /**
   * Retrieve whether the account is profit/loss sheet account.
   */
  get isPLSheet(): boolean {
    return this.isProfitLossSheet();
  }
  /**
   * Allows to mark model as resourceable to viewable and filterable.
   */
  static get resourceable() {
    return true;
  }

  /**
   * Model modifiers.
   */
  static get modifiers() {
    const TABLE_NAME = Account.tableName;

    return {
      /**
       * Inactive/Active mode.
       */
      inactiveMode(query, active = false) {
        query.where('accounts.active', !active);
      },

      filterAccounts(query, accountIds) {
        if (accountIds.length > 0) {
          query.whereIn(`${TABLE_NAME}.id`, accountIds);
        }
      },
      filterAccountTypes(query, typesIds) {
        if (typesIds.length > 0) {
          query.whereIn('account_types.account_type_id', typesIds);
        }
      },
      viewRolesBuilder(query, conditionals, expression) {
        // buildFilterQuery(Account.tableName, conditionals, expression)(query);
      },
      sortColumnBuilder(query, columnKey, direction) {
        // buildSortColumnQuery(Account.tableName, columnKey, direction)(query);
      },

      /**
       * Filter by root type.
       */
      filterByRootType(query, rootType) {
        const filterTypes = ACCOUNT_TYPES.filter(
          (accountType) => accountType.rootType === rootType,
        ).map((accountType) => accountType.key);

        query.whereIn('account_type', filterTypes);
      },

      /**
       * Filter by account normal
       */
      filterByAccountNormal(query, accountNormal) {
        const filterTypes = ACCOUNT_TYPES.filter(
          (accountType) => accountType.normal === accountNormal,
        ).map((accountType) => accountType.key);

        query.whereIn('account_type', filterTypes);
      },

      /**
       * Finds account by the given slug.
       * @param {*} query
       * @param {*} slug
       */
      findBySlug(query, slug) {
        query.where('slug', slug).first();
      },

      /**
       *
       * @param {*} query
       * @param {*} baseCyrrency
       */
      preventMutateBaseCurrency(query) {
        const accountsTypes = getAccountsSupportsMultiCurrency();
        const accountsTypesKeys = accountsTypes.map((type) => type.key);

        query
          .whereIn('accountType', accountsTypesKeys)
          .where('seededAt', null)
          .first();
      },
    };
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const { AccountTransaction } = require('./AccountTransaction.model');
    const { Item } = require('../../Items/models/Item');
    // const InventoryAdjustment = require('models/InventoryAdjustment');
    // const ManualJournalEntry = require('models/ManualJournalEntry');
    // const Expense = require('models/Expense');
    // const ExpenseEntry = require('models/ExpenseCategory');
    // const ItemEntry = require('models/ItemEntry');
    // const UncategorizedTransaction = require('models/UncategorizedCashflowTransaction');
    const { PlaidItem } = require('../../BankingPlaid/models/PlaidItem');

    return {
      /**
       * Account model may has many transactions.
       */
      transactions: {
        relation: Model.HasManyRelation,
        modelClass: AccountTransaction,
        join: {
          from: 'accounts.id',
          to: 'accounts_transactions.accountId',
        },
      },
      /**
       * Account may has many items as cost account.
       */
      itemsCostAccount: {
        relation: Model.HasManyRelation,
        modelClass: Item,
        join: {
          from: 'accounts.id',
          to: 'items.costAccountId',
        },
      },
      /**
       * Account may has many items as sell account.
       */
      itemsSellAccount: {
        relation: Model.HasManyRelation,
        modelClass: Item,
        join: {
          from: 'accounts.id',
          to: 'items.sellAccountId',
        },
      },
      //   /**
      //    *
      //    */
      //   inventoryAdjustments: {
      //     relation: Model.HasManyRelation,
      //     modelClass: InventoryAdjustment.default,
      //     join: {
      //       from: 'accounts.id',
      //       to: 'inventory_adjustments.adjustmentAccountId',
      //     },
      //   },
      //   /**
      //    *
      //    */
      //   manualJournalEntries: {
      //     relation: Model.HasManyRelation,
      //     modelClass: ManualJournalEntry.default,
      //     join: {
      //       from: 'accounts.id',
      //       to: 'manual_journals_entries.accountId',
      //     },
      //   },
      //   /**
      //    *
      //    */
      //   expensePayments: {
      //     relation: Model.HasManyRelation,
      //     modelClass: Expense.default,
      //     join: {
      //       from: 'accounts.id',
      //       to: 'expenses_transactions.paymentAccountId',
      //     },
      //   },
      //   /**
      //    *
      //    */
      //   expenseEntries: {
      //     relation: Model.HasManyRelation,
      //     modelClass: ExpenseEntry.default,
      //     join: {
      //       from: 'accounts.id',
      //       to: 'expense_transaction_categories.expenseAccountId',
      //     },
      //   },
      //   /**
      //    *
      //    */
      //   entriesCostAccount: {
      //     relation: Model.HasManyRelation,
      //     modelClass: ItemEntry.default,
      //     join: {
      //       from: 'accounts.id',
      //       to: 'items_entries.costAccountId',
      //     },
      //   },
      //   /**
      //    *
      //    */
      //   entriesSellAccount: {
      //     relation: Model.HasManyRelation,
      //     modelClass: ItemEntry.default,
      //     join: {
      //       from: 'accounts.id',
      //       to: 'items_entries.sellAccountId',
      //     },
      //   },
      //   /**
      //    * Associated uncategorized transactions.
      //    */
      //   uncategorizedTransactions: {
      //     relation: Model.HasManyRelation,
      //     modelClass: UncategorizedTransaction.default,
      //     join: {
      //       from: 'accounts.id',
      //       to: 'uncategorized_cashflow_transactions.accountId',
      //     },
      //     filter: (query) => {
      //       query.where('categorized', false);
      //     },
      //   },
      /**
       * Account model may belongs to a Plaid item.
       */
      plaidItem: {
        relation: Model.BelongsToOneRelation,
        modelClass: PlaidItem,
        join: {
          from: 'accounts.plaidItemId',
          to: 'plaid_items.plaidItemId',
        },
      },
    };
  }

  /**
   * Detarmines whether the given type equals the account type.
   * @param {string} accountType
   * @return {boolean}
   */
  isAccountType(accountType) {
    const types = castArray(accountType);
    return types.indexOf(this.accountType) !== -1;
  }

  /**
   * Detarmines whether the given root type equals the account type.
   * @param {string} rootType
   * @return {boolean}
   */
  isRootType(rootType) {
    return AccountTypesUtils.isRootTypeEqualsKey(this.accountType, rootType);
  }

  /**
   * Detarmine whether the given parent type equals the account type.
   * @param {string} parentType
   * @return {boolean}
   */
  isParentType(parentType) {
    return AccountTypesUtils.isParentTypeEqualsKey(
      this.accountType,
      parentType,
    );
  }

  /**
   * Detarmines whether the account is balance sheet account.
   * @return {boolean}
   */
  isBalanceSheet() {
    return AccountTypesUtils.isTypeBalanceSheet(this.accountType);
  }

  /**
   * Detarmines whether the account is profit/loss account.
   * @return {boolean}
   */
  isProfitLossSheet() {
    return AccountTypesUtils.isTypePLSheet(this.accountType);
  }

  /**
   * Detarmines whether the account is income statement account
   * @return {boolean}
   */
  isIncomeSheet() {
    return this.isProfitLossSheet();
  }

  /**
   * Converts flatten accounts list to nested array.
   * @param {Array} accounts
   * @param {Object} options
   */
  static toNestedArray(accounts, options = { children: 'children' }) {
    return flatToNestedArray(accounts, {
      id: 'id',
      parentId: 'parentAccountId',
    });
  }

  /**
   * Transformes the accounts list to depenedency graph structure.
   * @param {IAccount[]} accounts
   */
  static toDependencyGraph(accounts) {
    return DependencyGraph.fromArray(accounts, {
      itemId: 'id',
      parentItemId: 'parentAccountId',
    });
  }

  /**
   * Model settings.
   */
  // static get meta() {
  // return AccountSettings;
  // }

  /**
   * Retrieve the default custom views, roles and columns.
   */
  // static get defaultViews() {
  //   return DEFAULT_VIEWS;
  // }

  /**
   * Model search roles.
   */
  static get searchRoles() {
    return [
      { condition: 'or', fieldKey: 'name', comparator: 'contains' },
      { condition: 'or', fieldKey: 'code', comparator: 'like' },
    ];
  }

  /**
   * Prevents mutate base currency since the model is not empty.
   */
  static get preventMutateBaseCurrency() {
    return true;
  }
}
