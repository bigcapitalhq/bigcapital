import {
  Controller,
  Get,
  Query,
  Param,
  Patch,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { GetContactsAutoCompleteQuery } from './dtos/GetContactsAutoCompleteQuery.dto';
import { GetAutoCompleteContactsService } from './queries/GetAutoCompleteContacts.service';
import { ActivateContactService } from './commands/ActivateContact.service';
import { InactivateContactService } from './commands/InactivateContact.service';

@Controller('contacts')
@ApiTags('Contacts')
export class ContactsController {
  constructor(
    private readonly getAutoCompleteService: GetAutoCompleteContactsService,
    private readonly activateContactService: ActivateContactService,
    private readonly inactivateContactService: InactivateContactService,
  ) {}

  @Get('auto-complete')
  @ApiOperation({ summary: 'Get the auto-complete contacts' })
  getAutoComplete(@Query() query: GetContactsAutoCompleteQuery) {
    return this.getAutoCompleteService.autocompleteContacts(query);
  }

  @Patch(':id/activate')
  @ApiOperation({ summary: 'Activate a contact' })
  @ApiParam({ name: 'id', type: 'number', description: 'Contact ID' })
  async activateContact(@Param('id', ParseIntPipe) contactId: number) {
    await this.activateContactService.activateContact(contactId);
    return { id: contactId, activated: true };
  }

  @Patch(':id/inactivate')
  @ApiOperation({ summary: 'Inactivate a contact' })
  @ApiParam({ name: 'id', type: 'number', description: 'Contact ID' })
  async inactivateContact(@Param('id', ParseIntPipe) contactId: number) {
    await this.inactivateContactService.inactivateContact(contactId);
    return { id: contactId, inactivated: true };
  }
}
