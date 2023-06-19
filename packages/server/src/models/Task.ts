import { mixin, Model, raw } from 'objection';
import TenantModel from 'models/TenantModel';
import CustomViewBaseModel from './CustomViewBaseModel';
import ModelSetting from './ModelSetting';
import ModelSearchable from './ModelSearchable';
import { ProjectTaskChargeType } from '@/services/Projects/Tasks/constants';
import { number } from 'mathjs';

export default class Task extends mixin(TenantModel, [
  ModelSetting,
  CustomViewBaseModel,
  ModelSearchable,
]) {
  type!: string;
  rate!: number;
  actualHours!: number;
  invoicedHours!: number;
  estimateHours!: number;

  /**
   * Table name
   */
  static get tableName() {
    return 'tasks';
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
    return [
      'actualAmount',
      'invoicedAmount',
      'estimateAmount',
      'billableAmount',
      'billableHours',
    ];
  }

  /**
   * Retrieves the actual amount.
   */
  get actualAmount(): number {
    return this.rate * this.actualHours;
  }

  /**
   * Retrieves the invoiced amount.
   */
  get invoicedAmount(): number {
    return this.rate * this.invoicedHours;
  }

  /**
   * Retrieves the estimate amount.
   */
  get estimateAmount(): number {
    return this.rate * this.estimateHours;
  }

  /**
   * Retrieves the billable amount.
   */
  get billableAmount() {
    return this.actualAmount - this.invoicedAmount;
  }

  /**
   * Retrieves the billable hours.
   */
  get billableHours() {
    return this.actualHours - this.invoicedHours;
  }

  /**
   * Model modifiers.
   */
  static get modifiers() {
    return {
      /**
       * Summation of total actual hours.
       * @param builder
       */
      sumTotalActualHours(builder) {
        builder.sum('actualHours as totalActualHours');
      },

      /**
       * Summation total estimate hours.
       * @param builder
       */
      sumTotalEstimateHours(builder) {
        builder.sum('estimateHours as totalEstimateHours');
      },

      /**
       * Summation of total invoiced hours.
       * @param builder
       */
      sumTotalInvoicedHours(builder) {
        builder.sum('invoicedHours as totalInvoicedHours');
      },

      /**
       * Summation of total actual amount.
       * @param builder
       */
      sumTotalActualAmount(builder) {
        builder.groupBy('totalActualAmount');
        builder.select(raw('ACTUAL_HOURS * RATE').as('totalActualAmount'));
      },

      /**
       * Summation of total invoiced amount.
       * @param builder
       */
      sumTotalInvoicedAmount(builder) {
        this.groupBy('totalInvoicedAmount');
        builder.select(raw('INVOICED_HOURS * RATE').as('totalInvoicedAmount'));
      },

      /**
       * Summation of total estimate amount.
       * @param builder
       */
      sumTotalEstimateAmount(builder) {
        builder.groupBy('totalEstimateAmount');
        builder.select(raw('ESTIMATE_HOURS * RATE').as('totalEstimateAmount'));
      },
    };
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const Time = require('models/Time');
    const Project = require('models/Project');

    return {
      /**
       * Project may has many associated tasks.
       */
      times: {
        relation: Model.HasManyRelation,
        modelClass: Time.default,
        join: {
          from: 'tasks.id',
          to: 'times.taskId',
        },
      },

      /**
       * Project may has many associated times.
       */
      project: {
        relation: Model.BelongsToOneRelation,
        modelClass: Project.default,
        join: {
          from: 'tasks.projectId',
          to: 'projects.id',
        },
      },
    };
  }
}
