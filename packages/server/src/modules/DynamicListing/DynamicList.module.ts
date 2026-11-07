import { Module } from '@nestjs/common';
import { DynamicListService } from './DynamicList.service';
import { DynamicListCustomView } from './DynamicListCustomView.service';
import { DynamicListSortBy } from './DynamicListSortBy.service';
import { DynamicListSearch } from './DynamicListSearch.service';
import { DynamicListFilterRoles } from './DynamicListFilterRoles.service';
import { CustomFieldsModule } from '../CustomFields/CustomFields.module';

@Module({
  imports: [CustomFieldsModule],
  providers: [
    DynamicListService,
    DynamicListCustomView,
    DynamicListSortBy,
    DynamicListSearch,
    DynamicListFilterRoles,
  ],
  exports: [DynamicListService],
})
export class DynamicListModule {}
