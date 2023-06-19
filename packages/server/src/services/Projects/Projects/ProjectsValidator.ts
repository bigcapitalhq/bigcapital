import HasTenancyService from '@/services/Tenancy/TenancyService';
import { Inject, Service } from 'typedi';

@Service()
export class ProjectsValidator {
  @Inject()
  private tenancy: HasTenancyService;

  /**
   * Validate contact exists.
   * @param {number} tenantId
   * @param {number} contactId
   */
  public async validateContactExists(tenantId: number, contactId: number) {
    const { Contact } = this.tenancy.models(tenantId);

    // Validate customer existence.
    await Contact.query()
      .modify('customer')
      .findById(contactId)
      .throwIfNotFound();
  }
}
