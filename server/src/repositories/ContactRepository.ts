import TenantRepository from 'repositories/TenantRepository';

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

  findById(contactId: number) {
    const { Contact } = this.models;
    return this.cache.get(`contact.id.${contactId}`, () => {
      return Contact.query().findById(contactId);
    })
  }

  findByIds(contactIds: number[]) {
    const { Contact } = this.models;
    return this.cache.get(`contact.ids.${contactIds.join(',')}`, () => {
      return Contact.query().whereIn('id', contactIds);
    });
  }

  insert(contact) {

  }
}