import TenantRepository from '@/repositories/TenantRepository';
import { Bill } from 'models';
import moment from 'moment';

export default class BillRepository extends TenantRepository {
  /**
   * Gets the repository's model.
   */
  get model() {
    return Bill.bindKnex(this.knex);
  }

  dueBills(asDate = moment().format('YYYY-MM-DD'), withRelations) {
    return this.model
      .query()
      .modify('dueBills')
      .modify('notOverdue')
      .modify('fromDate', asDate)
      .withGraphFetched(withRelations);
  }

  overdueBills(asDate = moment().format('YYYY-MM-DD'), withRelations) {
    return this.model
      .query()
      .modify('dueBills')
      .modify('overdue', asDate)
      .modify('fromDate', asDate)
      .withGraphFetched(withRelations);
  }
}
