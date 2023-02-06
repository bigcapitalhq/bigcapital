import { mixin, Model } from 'objection';
import TenantModel from 'models/TenantModel';
import CustomViewBaseModel from './CustomViewBaseModel';
import ModelSetting from './ModelSetting';
import ModelSearchable from './ModelSearchable';

export default class Project extends mixin(TenantModel, [
  ModelSetting,
  CustomViewBaseModel,
  ModelSearchable,
]) {
  costEstimate!: number;
  deadline!: Date;

  /**
   * Table name
   */
  static get tableName() {
    return 'projects';
  }

  /**
   * Timestamps columns.
   */
  get timestamps() {
    return ['created_at', 'updated_at'];
  }

  /**
   * Virtual attributes.
   */
  static get virtualAttributes() {
    return [];
  }

  /**
   * Model modifiers.
   */
  static get modifiers() {
    return {
      totalExpensesDetails(builder) {
        builder
          .withGraphFetched('expenses')
          .modifyGraph('expenses', (builder) => {
            builder.select(['projectId']);
            builder.groupBy('projectId');

            builder.sum('totalAmount as totalExpenses');
            builder.sum('invoicedAmount as totalInvoicedExpenses');
          });
      },

      totalBillsDetails(builder) {
        builder.withGraphFetched('tasks').modifyGraph('tasks', (builder) => {
          builder.select(['projectId']);
          builder.groupBy('projectId');

          builder.modify('sumTotalActualHours');
          builder.modify('sumTotalEstimateHours');
          builder.modify('sumTotalInvoicedHours');

          builder.modify('sumTotalActualAmount');
          builder.modify('sumTotalInvoicedAmount');
          builder.modify('sumTotalEstimateAmount');
        });
      },

      totalTasksDetails(builder) {
        builder.withGraphFetched('tasks').modifyGraph('tasks', (builder) => {
          builder.select(['projectId']);
          builder.groupBy('projectId');

          builder.modify('sumTotalActualHours');
          builder.modify('sumTotalEstimateHours');
          builder.modify('sumTotalInvoicedHours');

          builder.modify('sumTotalActualAmount');
          builder.modify('sumTotalInvoicedAmount');
          builder.modify('sumTotalEstimateAmount');
        });
      },
    };
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const Contact = require('models/Contact');
    const Task = require('models/Task');
    const Time = require('models/Time');
    const Expense = require('models/Expense');
    const Bill = require('models/Bill');

    return {
      /**
       * Belongs to customer model.
       */
      contact: {
        relation: Model.BelongsToOneRelation,
        modelClass: Contact.default,
        join: {
          from: 'projects.contactId',
          to: 'contacts.id',
        },
      },

      /**
       * Project may has many associated tasks.
       */
      tasks: {
        relation: Model.HasManyRelation,
        modelClass: Task.default,
        join: {
          from: 'projects.id',
          to: 'tasks.projectId',
        },
      },

      /**
       * Project may has many associated times.
       */
      times: {
        relation: Model.HasManyRelation,
        modelClass: Time.default,
        join: {
          from: 'projects.id',
          to: 'times.projectId',
        },
      },

      /**
       * Project may has many associated expenses.
       */
      expenses: {
        relation: Model.HasManyRelation,
        modelClass: Expense.default,
        join: {
          from: 'projects.id',
          to: 'expenses_transactions.projectId',
        },
      },

      /**
       * Project may has many associated bills.
       */
      bills: {
        relation: Model.HasManyRelation,
        modelClass: Bill.default,
        join: {
          from: 'projects.id',
          to: 'bills.projectId',
        },
      },
    };
  }
}
