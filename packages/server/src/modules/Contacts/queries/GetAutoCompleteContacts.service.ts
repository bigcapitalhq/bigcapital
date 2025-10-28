import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { Contact } from '../models/Contact';
import { Inject, Injectable } from '@nestjs/common';
import { IContactsAutoCompleteFilter } from '../Contacts.types';
import { GetContactsAutoCompleteQuery } from '../dtos/GetContactsAutoCompleteQuery.dto';

@Injectable()
export class GetAutoCompleteContactsService {
  constructor(
    @Inject(Contact.name)
    private readonly contactModel: TenantModelProxy<typeof Contact>,
  ) {}

  /**
   * Retrieve auto-complete contacts list.
   * @param {number} tenantId -
   * @param {IContactsAutoCompleteFilter} contactsFilter -
   * @return {IContactAutoCompleteItem}
   */
  async autocompleteContacts(queryDto: GetContactsAutoCompleteQuery) {
    const _queryDto = {
      filterRoles: [],
      sortOrder: 'asc',
      columnSortBy: 'display_name',
      limit: 10,
      ...queryDto,
    };
    // Retrieve contacts list by the given query.
    const contacts = await this.contactModel()
      .query()
      .onBuild((builder) => {
        if (_queryDto.keyword) {
          builder.where('display_name', 'LIKE', `%${_queryDto.keyword}%`);
        }
        builder.limit(_queryDto.limit);
      });
    return contacts;
  }
}
