import { Module } from '@nestjs/common';
import { GetAutoCompleteContactsService } from './queries/GetAutoCompleteContacts.service';
import { ContactsController } from './Contacts.controller';
import { ActivateContactService } from './commands/ActivateContact.service';
import { InactivateContactService } from './commands/InactivateContact.service';

@Module({
  providers: [
    GetAutoCompleteContactsService,
    ActivateContactService,
    InactivateContactService,
  ],
  controllers: [ContactsController],
})
export class ContactsModule {}
