import { Inject, Injectable } from '@nestjs/common';
import { ServiceError } from '@/modules/Items/ServiceError';
import { Contact } from '../models/Contact';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { ERRORS } from '../Contacts.constants';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';

@Injectable()
export class InactivateContactService {
  constructor(
    @Inject(Contact.name)
    private readonly contactModel: TenantModelProxy<typeof Contact>,

    private readonly eventEmitter: EventEmitter2,
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

    // Triggers `onContactInactivated` event.
    await this.eventEmitter.emitAsync(events.contacts.onInactivated, {
      contactId,
      contact,
    });
  }
}
