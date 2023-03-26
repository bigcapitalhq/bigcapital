import moment from 'moment';
import { Bill } from 'models';
import TenantRepository from '@/repositories/TenantRepository';

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
