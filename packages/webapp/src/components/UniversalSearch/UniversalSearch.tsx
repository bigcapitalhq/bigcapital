// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import classNames from 'classnames';
import { isUndefined } from 'lodash';
import {
  Overlay,
  InputGroup,
  Tag,
  MenuItem,
  Spinner,
  Intent,
} from '@blueprintjs/core';
import { QueryList } from '@blueprintjs/select';
import { CLASSES } from '@/constants/classes';

import { Icon, If, ListSelect, FormattedMessage as T } from '@/components';
import {
  UniversalSearchProvider,
  useUniversalSearchContext,
} from './UniversalSearchProvider';
import { filterItemsByResourceType } from './utils';
import { RESOURCES_TYPES } from '@/constants/resourcesTypes';

/**
 * Universal search input action.
 */
function UniversalSearchInputRightElements({ onSearchTypeChange }) {
  const { isLoading, searchType, defaultSearchResource, searchTypeOptions } =
    useUniversalSearchContext();

  // Handle search type option change.
  const handleSearchTypeChange = (option) => {
    onSearchTypeChange && onSearchTypeChange(option);
  };

  return (
    <div className={CLASSES.UNIVERSAL_SEARCH_INPUT_RIGHT_ELEMENTS}>
      <If condition={isLoading}>
        <Spinner tagName="div" intent={Intent.NONE} size={18} value={null} />
      </If>

      <ListSelect
        items={searchTypeOptions}
        onItemSelect={handleSearchTypeChange}
        filterable={false}
        initialSelectedItem={defaultSearchResource}
        selectedItem={searchType}
        selectedItemProp={'key'}
        textProp={'label'}
        // defaultText={intl.get('type')}
        popoverProps={{
          minimal: true,
          captureDismiss: true,
          className: CLASSES.UNIVERSAL_SEARCH_TYPE_SELECT_OVERLAY,
        }}
        buttonProps={{
          minimal: true,
          className: CLASSES.UNIVERSAL_SEARCH_TYPE_SELECT_BTN,
        }}
      />
    </div>
  );
}

/**
 * Universal search query list.
 */
function UniversalSearchQueryList(props) {
  const { isOpen, isLoading, onSearchTypeChange, searchType, ...restProps } =
    props;

  return (
    <QueryList
      {...restProps}
      initialContent={null}
      renderer={(listProps) => (
        <UniversalSearchBar
          isOpen={isOpen}
          onSearchTypeChange={onSearchTypeChange}
          {...listProps}
        />
      )}
      noResults={
        !isLoading ? (
          <MenuItem disabled={true} text={<T id={'no_results'} />} />
        ) : (
          <MenuItem
            disabled={true}
            text={<T id={'universal_search.loading'} />}
          />
        )
      }
    />
  );
}

/**
 * Universal query search actions.
 */
function UniversalQuerySearchActions() {
  return (
    <div className={classNames(CLASSES.UNIVERSAL_SEARCH_ACTIONS)}>
      <div className={classNames(CLASSES.UNIVERSAL_SEARCH_ACTION_SELECT)}>
        <Tag>ENTER</Tag>
        <span class={'text'}>{intl.get('universal_search.enter_text')}</span>
      </div>

      <div className={classNames(CLASSES.UNIVERSAL_SEARCH_ACTION_CLOSE)}>
        <Tag>ESC</Tag>{' '}
        <span class={'text'}>{intl.get('universal_search.close_text')}</span>
      </div>

      <div className={classNames(CLASSES.UNIVERSAL_SEARCH_ACTION_ARROWS)}>
        <Tag>
          <Icon icon={'arrow-up-24'} iconSize={16} />
        </Tag>
        <Tag>
          <Icon icon={'arrow-down-24'} iconSize={16} />
        </Tag>
        <span class="text">{intl.get('universal_search.navigate_text')}</span>
      </div>
    </div>
  );
}

/**
 * Universal search input bar with items list.
 */
function UniversalSearchBar({ isOpen, onSearchTypeChange, ...listProps }) {
  const { handleKeyDown, handleKeyUp } = listProps;
  const handlers = isOpen
    ? { onKeyDown: handleKeyDown, onKeyUp: handleKeyUp }
    : {};

  return (
    <div
      className={classNames(
        CLASSES.UNIVERSAL_SEARCH_OMNIBAR,
        listProps.className,
      )}
      {...handlers}
    >
      <InputGroup
        large={true}
        leftIcon={<Icon icon={'universal-search'} iconSize={20} />}
        placeholder={intl.get('universal_search.placeholder')}
        onChange={listProps.handleQueryChange}
        value={listProps.query}
        rightElement={
          <UniversalSearchInputRightElements
            onSearchTypeChange={onSearchTypeChange}
          />
        }
      />
      {listProps.itemList}
    </div>
  );
}

/**
 * Universal search.
 */
export function UniversalSearch({
  defaultSearchResource,
  searchResource,

  overlayProps,
  isOpen,
  isLoading,
  onSearchTypeChange,
  items,
  searchTypeOptions,
  ...queryListProps
}) {
  // Search type state.
  const [searchType, setSearchType] = React.useState(
    defaultSearchResource || RESOURCES_TYPES.CUSTOMER,
  );
  // Handle search resource type controlled mode.
  React.useEffect(() => {
    if (
      !isUndefined(searchResource) &&
      searchResource !== defaultSearchResource
    ) {
      setSearchType(searchResource);
    }
  }, [searchResource, defaultSearchResource]);

  // Handle search type change.
  const handleSearchTypeChange = (searchTypeResource) => {
    setSearchType(searchTypeResource.key);
    onSearchTypeChange && onSearchTypeChange(searchTypeResource);
  };
  // Filters query list items based on the given search type.
  const filteredItems = filterItemsByResourceType(items, searchType);

  return (
    <Overlay
      hasBackdrop={true}
      isOpen={isOpen}
      className={classNames(CLASSES.UNIVERSAL_SEARCH_OVERLAY)}
      {...overlayProps}
    >
      <UniversalSearchProvider
        isLoading={isLoading}
        searchType={searchType}
        defaultSearchResource={defaultSearchResource}
        searchTypeOptions={searchTypeOptions}
      >
        <div className={classNames(CLASSES.UNIVERSAL_SEARCH)}>
          <UniversalSearchQueryList
            isOpen={isOpen}
            isLoading={isLoading}
            searchType={searchType}
            onSearchTypeChange={handleSearchTypeChange}
            {...queryListProps}
            items={filteredItems}
          />
          <div className={classNames(CLASSES.UNIVERSAL_SEARCH_FOOTER)}>
            <UniversalQuerySearchActions />
          </div>
        </div>
      </UniversalSearchProvider>
    </Overlay>
  );
}
