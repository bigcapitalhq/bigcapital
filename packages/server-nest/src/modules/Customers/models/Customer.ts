import { Model, mixin } from 'objection';
import { BaseModel } from '@/models/Model';
// import TenantModel from 'models/TenantModel';
// import PaginationQueryBuilder from './Pagination';
// import ModelSetting from './ModelSetting';
// import CustomerSettings from './Customer.Settings';
// import CustomViewBaseModel from './CustomViewBaseModel';
// import { DEFAULT_VIEWS } from '@/services/Contacts/Customers/constants';
// import ModelSearchable from './ModelSearchable';

// class CustomerQueryBuilder extends PaginationQueryBuilder {
//   constructor(...args) {
//     super(...args);

//     this.onBuild((builder) => {
//       if (builder.isFind() || builder.isDelete() || builder.isUpdate()) {
//         builder.where('contact_service', 'customer');
//       }
//     });
//   }
// }

export class Customer extends BaseModel{
  contactService: string;
  contactType: string;

  balance: number;
  currencyCode: string;

  openingBalance: number;
  openingBalanceAt: Date | string;
  openingBalanceExchangeRate: number;
  openingBalanceBranchId?: number;

  salutation?: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;

  displayName: string;

  email?: string;
  workPhone?: string;
  personalPhone?: string;
  website?: string;

  billingAddress1?: string;
  billingAddress2?: string;
  billingAddressCity?: string;
  billingAddressCountry?: string;
  billingAddressEmail?: string;
  billingAddressPostcode?: string;
  billingAddressPhone?: string;
  billingAddressState?: string;

  shippingAddress1?: string;
  shippingAddress2?: string;
  shippingAddressCity?: string;
  shippingAddressCountry?: string;
  shippingAddressEmail?: string;
  shippingAddressPostcode?: string;
  shippingAddressPhone?: string;
  shippingAddressState?: string;

  note: string;
  active: boolean;


  /**
   * Query builder.
   */
  // static get QueryBuilder() {
  //   return CustomerQueryBuilder;
  // }

  /**
   * Table name
   */
  static get tableName() {
    return 'contacts';
  }

  /**
   * Model timestamps.
   */
  get timestamps() {
    return ['createdAt', 'updatedAt'];
  }

  /**
   * Defined virtual attributes.
   */
  static get virtualAttributes() {
    return ['localOpeningBalance', 'closingBalance', 'contactNormal'];
  }

  /**
   * Closing balance attribute.
   */
  get closingBalance() {
    return this.balance;
  }

  /**
   * Retrieves the local opening balance.
   * @returns {number}
   */
  get localOpeningBalance() {
    return this.openingBalance
      ? this.openingBalance * this.openingBalanceExchangeRate
      : 0;
  }

  /**
   * Retrieve the contact noraml;
   */
  get contactNormal() {
    return 'debit';
  }

  /**
   *
   */
  get contactAddresses() {
    return [
      {
        mail: this.email,
        label: this.displayName,
        primary: true
      },
    ].filter((c) => c.mail);
  }

  /**
   * Model modifiers.
   */
  static get modifiers() {
    return {
      /**
       * Inactive/Active mode.
       */
      inactiveMode(query, active = false) {
        query.where('active', !active);
      },

      /**
       * Filters the active customers.
       */
      active(query) {
        query.where('active', 1);
      },
      /**
       * Filters the inactive customers.
       */
      inactive(query) {
        query.where('active', 0);
      },
      /**
       * Filters the customers that have overdue invoices.
       */
      overdue(query) {
        query.select(
          '*',
          Customer.relatedQuery('overDueInvoices', query.knex())
            .count()
            .as('countOverdue')
        );
        query.having('countOverdue', '>', 0);
      },
      /**
       * Filters the unpaid customers.
       */
      unpaid(query) {
        query.whereRaw('`BALANCE` + `OPENING_BALANCE` <> 0');
      },
    };
  }

  /**
   * Relationship mapping.
   */
  // static get relationMappings() {
  //   const SaleInvoice = require('models/SaleInvoice');

  //   return {
  //     salesInvoices: {
  //       relation: Model.HasManyRelation,
  //       modelClass: SaleInvoice.default,
  //       join: {
  //         from: 'contacts.id',
  //         to: 'sales_invoices.customerId',
  //       },
  //     },

  //     overDueInvoices: {
  //       relation: Model.HasManyRelation,
  //       modelClass: SaleInvoice.default,
  //       join: {
  //         from: 'contacts.id',
  //         to: 'sales_invoices.customerId',
  //       },
  //       filter: (query) => {
  //         query.modify('overdue');
  //       },
  //     },
  //   };
  // }

  // static get meta() {
  //   return CustomerSettings;
  // }

  // /**
  //  * Retrieve the default custom views, roles and columns.
  //  */
  // static get defaultViews() {
  //   return DEFAULT_VIEWS;
  // }

  /**
   * Model search attributes.
   */
  static get searchRoles() {
    return [
      { fieldKey: 'display_name', comparator: 'contains' },
      { condition: 'or', fieldKey: 'first_name', comparator: 'contains' },
      { condition: 'or', fieldKey: 'last_name', comparator: 'equals' },
      { condition: 'or', fieldKey: 'company_name', comparator: 'equals' },
      { condition: 'or', fieldKey: 'email', comparator: 'equals' },
      { condition: 'or', fieldKey: 'work_phone', comparator: 'equals' },
      { condition: 'or', fieldKey: 'personal_phone', comparator: 'equals' },
      { condition: 'or', fieldKey: 'website', comparator: 'equals' },
    ];
  }
}
