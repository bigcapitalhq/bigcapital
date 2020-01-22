import BaseModel from '@/models/Model';

export default class Budget extends BaseModel {
  /**
   * Table name
   */
  static get tableName() {
    return 'budgets';
  }

  static get virtualAttributes() {
    return ['rangeBy', 'rangeIncrement'];
  }

  /**
   * Model modifiers.
   */
  static get modifiers() {
    return {
      filterByYear(query, year) {
        query.where('year', year);
      },
      filterByIncomeStatement(query) {
        query.where('account_types', 'income_statement');
      },
      filterByProfitLoss(query) {
        query.where('accounts_types', 'profit_loss');
      },
    };
  }

  get rangeBy() {
    switch (this.period) {
      case 'half-year':
      case 'quarter':
        return 'month';
      default:
        return this.period;
    }
  }

  get rangeIncrement() {
    switch (this.period) {
      case 'half-year':
        return 6;
      case 'quarter':
        return 3;
      default:
        return 1;
    }
  }

  get rangeOffset() {
    switch (this.period) {
      case 'half-year': return 5;
      case 'quarter': return 2;
      default: return 0;
    }
  }
}
