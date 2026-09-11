import * as FF from 'fp-ts/function';
import { debounce } from 'lodash';
import { isUndefined } from 'lodash';
import React from 'react';
import { DashboardUniversalSearchItem } from './components';
import { DashboardUniversalSearchHotkeys } from './DashboardUniversalSearchHotkeys';
import { DashboardUniversalSearchItemActions } from './DashboardUniversalSearchItemActions';
import { useGetUniversalSearchTypeOptions } from './utils';
import { withUniversalSearch } from './withUniversalSearch';
import { withUniversalSearchActions } from './withUniversalSearchActions';
import type { WithUniversalSearchActionsProps } from './withUniversalSearchActions';
import type {
  SearchTypeOption,
  UniversalSearchItem,
} from '@/components/UniversalSearch/UniversalSearch';
import { UniversalSearch } from '@/components';
import { RESOURCES_TYPES } from '@/constants/resourcesTypes';
import { useUniversalSearch } from '@/hooks/query';

interface DashboardUniversalSearchInnerProps {
  setSelectedItemUniversalSearch: WithUniversalSearchActionsProps['setSelectedItemUniversalSearch'];
  closeGlobalSearch: WithUniversalSearchActionsProps['closeGlobalSearch'];

  globalSearchShow: boolean;
  defaultUniversalResourceType: string;
}

/**
 * Dashboard universal search.
 */
function DashboardUniversalSearchInner({
  // #withUniversalSearchActions
  setSelectedItemUniversalSearch,
  closeGlobalSearch,

  // #withUniversalSearch
  globalSearchShow,
  defaultUniversalResourceType,
}: DashboardUniversalSearchInnerProps) {
  const searchTypeOptions = useGetUniversalSearchTypeOptions();

  // Search keyword.
  const [searchKeyword, setSearchKeyword] = React.useState('');

  // Default search type.
  const [defaultSearchType, setDefaultSearchType] = React.useState(
    defaultUniversalResourceType || RESOURCES_TYPES.CUSTOMER,
  );
  // Search type.
  const [searchType, setSearchType] = React.useState(defaultSearchType);

  // Sync default search type with default universal resource type.
  React.useEffect(() => {
    if (
      !isUndefined(defaultUniversalResourceType) &&
      defaultSearchType !== defaultUniversalResourceType
    ) {
      setSearchType(defaultUniversalResourceType);
      setDefaultSearchType(defaultUniversalResourceType);
    }
  }, [defaultSearchType, defaultUniversalResourceType]);

  // Fetch accounts list according to the given custom view id.
  const {
    data,
    isFetching: isSearchFetching,
    refetch,
  } = useUniversalSearch(searchType, searchKeyword, {
    keepPreviousData: true,
    enabled: false,
  });

  // Handle query change.
  const handleQueryChange = (query: string) => {
    setSearchKeyword(query);
  };
  // Handle search type change.
  const handleSearchTypeChange = (type: SearchTypeOption) => {
    setSearchType(type.key);
  };
  // Handle overlay of universal search close.
  const handleClose = () => {
    closeGlobalSearch();
  };
  // Handle universal search item select.
  const handleItemSelect = (item: UniversalSearchItem) => {
    setSelectedItemUniversalSearch(searchType, item.id);
    closeGlobalSearch();
    setSearchKeyword('');
  };
  const debounceFetch = React.useRef(
    debounce(() => {
      refetch();
    }, 200),
  );

  React.useEffect(() => {
    if (searchKeyword && searchType) {
      debounceFetch.current();
    }
  }, [searchKeyword, searchType]);

  // Handles the overlay once be closed.
  const handleOverlayClosed = () => {
    setSearchKeyword('');
  };

  if (searchTypeOptions.length === 0) {
    return null;
  }

  return (
    <div className="dashboard__universal-search">
      <UniversalSearch
        isOpen={globalSearchShow}
        isLoading={isSearchFetching}
        items={data}
        overlayProps={{
          onClose: handleClose,
          onClosed: handleOverlayClosed,
        }}
        searchResource={searchType}
        onQueryChange={handleQueryChange}
        onSearchTypeChange={handleSearchTypeChange}
        onItemSelect={handleItemSelect}
        itemRenderer={DashboardUniversalSearchItem}
        query={searchKeyword}
        searchTypeOptions={searchTypeOptions}
      />
      <DashboardUniversalSearchItemActions />
      <DashboardUniversalSearchHotkeys />
    </div>
  );
}

export const DashboardUniversalSearch = FF.pipe(
  DashboardUniversalSearchInner,
  withUniversalSearch(({ globalSearchShow, defaultUniversalResourceType }) => ({
    globalSearchShow,
    defaultUniversalResourceType,
  })),
  withUniversalSearchActions,
);
