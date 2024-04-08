import TenantRepository from '@/repositories/TenantRepository';
import { ManualJournal } from '../models';

export default class JournalRepository extends TenantRepository {
  /**
   * Gets the repository's model.
   */
  get model() {
    return ManualJournal.bindKnex(this.knex);
  }
}
