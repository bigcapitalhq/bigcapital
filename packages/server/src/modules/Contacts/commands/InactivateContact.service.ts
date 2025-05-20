import { Inject, Injectable } from '@nestjs/common';
import { ServiceError } from '@/modules/Items/ServiceError';
import { Contact } from '../models/Contact';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { ERRORS } from '../Contacts.constants';

@Injectable()
export class InactivateContactService {
  constructor(
    @Inject(Contact.name)
    private readonly contactModel: TenantModelProxy<typeof Contact>,
  ) {}

  async inactivateContact(contactId: number) {
    const contact = await this.contactModel()
      .query()
      .findById(contactId)
      .throwIfNotFound();

    if (!contact.active) {
      throw new ServiceError(ERRORS.CONTACT_ALREADY_INACTIVE);
    }
    await this.contactModel()
      .query()
      .findById(contactId)
      .update({ active: false });
  }
}
