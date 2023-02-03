import TenantRepository from '@/repositories/TenantRepository';
import { Contact } from 'models'


export default class ContactRepository extends TenantRepository {
  /**
   * Gets the repository's model.
   */
  get model() {
    return Contact.bindKnex(this.knex);
  }
}