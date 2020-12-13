import TenantRepository from "./TenantRepository";
import { ExpenseCategory } from 'models';

export default class ExpenseEntyRepository extends TenantRepository {
  /**
   * Constructor method.
   */
  constructor(knex, cache) {
    super(knex, cache);
    this.model = ExpenseCategory;
  }
}