import TenantRepository from 'repositories/TenantRepository';
import { IContact } from 'interfaces';
import Contact from 'models/Contact';

export default class ContactRepository extends TenantRepository {
  cache: any;
  models: any;

  /**
   * Constructor method.
   * @param {number} tenantId - The given tenant id.
   */
  constructor(
    tenantId: number,
  ) {
    super(tenantId);

    this.models = this.tenancy.models(tenantId);
    this.cache = this.tenancy.cache(tenantId);
  }

  /**
   * Retrieve the given contact model.
   * @param {number} contactId 
   */ 
  findById(contactId: number): IContact {
    const { Contact } = this.models;
    return this.cache.get(`contacts.id.${contactId}`, () => {
      return Contact.query().findById(contactId);
    })
  }

  /**
   * Retrieve the given contacts model.
   * @param {number[]} contactIds - Contacts ids.
   */
  findByIds(contactIds: number[]): IContact[] {
    const { Contact } = this.models;
    return this.cache.get(`contacts.ids.${contactIds.join(',')}`, () => {
      return Contact.query().whereIn('id', contactIds);
    });
  }

  /**
   * Inserts a new contact model.
   * @param contact 
   */
  async insert(contact) {
    await Contact.query().insert({ ...contact })
    this.flushCache();
  }

  /**
   * Updates the contact details.
   * @param {number} contactId - Contact id.
   * @param {IContact} contact - Contact input.
   */
  async update(contactId: number, contact: IContact) {
    await Contact.query().findById(contactId).patch({ ...contact });
    this.flushCache();
  }

  /**
   * Deletes contact of the given id.
   * @param {number} contactId -
   * @return {Promise<void>}
   */
  async deleteById(contactId: number): Promise<void> {
    await Contact.query().where('id', contactId).delete();
    this.flushCache();
  }

  /**
   * Deletes contacts in bulk.
   * @param {number[]} contactsIds 
   */
  async bulkDelete(contactsIds: number[]) {
    await Contact.query().whereIn('id', contactsIds);
    this.flushCache();
  }

  /**
   * Flush contact repository cache.
   */
  flushCache() {
    this.cache.delStartWith(`contacts`);
  }
}