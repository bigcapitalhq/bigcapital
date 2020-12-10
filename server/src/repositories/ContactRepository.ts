import TenantRepository from 'repositories/TenantRepository';
import { IContact } from 'interfaces';

export default class ContactRepository extends TenantRepository {
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
  async insert(contactInput: IContact) {
    const { Contact } = this.models;
    const contact = await Contact.query().insert({ ...contactInput })
    this.flushCache();
    return contact;
  }

  /**
   * Updates the contact details.
   * @param {number} contactId - Contact id.
   * @param {IContact} contact - Contact input.
   */
  async update(contactId: number, contact: IContact) {
    const { Contact } = this.models;
    await Contact.query().findById(contactId).patch({ ...contact });
    this.flushCache();
  }

  /**
   * Deletes contact of the given id.
   * @param {number} contactId -
   * @return {Promise<void>}
   */
  async deleteById(contactId: number): Promise<void> {
    const { Contact } = this.models;
    await Contact.query().where('id', contactId).delete();
    this.flushCache();
  }

  /**
   * Deletes contacts in bulk.
   * @param {number[]} contactsIds 
   */
  async bulkDelete(contactsIds: number[]) {
    const { Contact } = this.models;
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