import { Module } from '@nestjs/common';
import { DynamicListService } from './DynamicList.service';
import { DynamicListCustomView } from './DynamicListCustomView.service';
import { DynamicListSortBy } from './DynamicListSortBy.service';
import { DynamicListSearch } from './DynamicListSearch.service';
import { DynamicListFilterRoles } from './DynamicListFilterRoles.service';

@Module({
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
