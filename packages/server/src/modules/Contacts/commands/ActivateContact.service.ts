import { ServiceError } from '@/modules/Items/ServiceError';
import { Contact } from '../models/Contact';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ERRORS } from '../Contacts.constants';
import { events } from '@/common/events/events';

@Injectable()
export class ActivateContactService {
  constructor(
    @Inject(Contact.name)
    private readonly contactModel: TenantModelProxy<typeof Contact>,

    private readonly eventEmitter: EventEmitter2,
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

    // Triggers `onContactActivated` event.
    await this.eventEmitter.emitAsync(events.contacts.onActivated, {
      contactId,
      contact,
    });
  }
}
