import { ServiceError } from '@/modules/Items/ServiceError';
import { Contact } from '../models/Contact';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { Inject, Injectable } from '@nestjs/common';
import { ERRORS } from '../Contacts.constants';

@Injectable()
export class ActivateContactService {
  constructor(
    @Inject(Contact.name)
    private readonly contactModel: TenantModelProxy<typeof Contact>,
  ) {}

  async activateContact(contactId: number) {
    const contact = await this.contactModel()
      .query()
      .findById(contactId)
      .throwIfNotFound();

    if (contact.active) {
      throw new ServiceError(ERRORS.CONTACT_ALREADY_ACTIVE);
    }
    await this.contactModel()
      .query()
      .findById(contactId)
      .update({ active: true });
  }
}
