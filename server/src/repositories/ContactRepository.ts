import TenantRepository from 'repositories/TenantRepository';
import { Contact } from 'models'


export default class ContactRepository extends TenantRepository {
  /**
   * Constructor method.
   */
  constructor(knex, cache) {
    super(knex, cache);
    this.model = Contact;
  }
}