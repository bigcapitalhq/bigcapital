import React, { KeyboardEvent, ReactNode } from 'react';
import intl from 'react-intl-universal';
import { isUndefined } from 'lodash';
import {
  Overlay,
  InputGroup,
  Tag,
  MenuItem,
  Spinner,
  Intent,
  OverlayProps,
  Button,
} from '@blueprintjs/core';
import { QueryList, ItemRenderer } from '@blueprintjs/select';
import { x } from '@xstyled/emotion';
import { css } from '@emotion/css';
import { Icon, If, FormattedMessage as T } from '@/components';
import { Select } from '@blueprintjs-formik/select';
import {
  UniversalSearchProvider,
  useUniversalSearchContext,
} from './UniversalSearchProvider';
import { filterItemsByResourceType } from './utils';
import { RESOURCES_TYPES } from '@/constants/resourcesTypes';

// Resource type from RESOURCES_TYPES constant
type ResourceType = string;

// Search type option item
interface SearchTypeOption {
  key: ResourceType;
  label: string;
}

// Universal search item
interface UniversalSearchItem {
  id: number | string;
  _type: ResourceType;
  text: string;
  subText?: string;
  label?: string;
  [key: string]: any;
}

// CSS styles for complex selectors
const overlayStyles = css`
  .bp4-overlay-appear,
  .bp4-overlay-enter {
    filter: blur(20px);
    opacity: 0.2;
  }
  .bp4-overlay-appear-active,
  .bp4-overlay-enter-active {
    filter: blur(0);
    opacity: 1;
    transition:
      filter 0.2s cubic-bezier(0.4, 1, 0.75, 0.9),
      opacity 0.2s cubic-bezier(0.4, 1, 0.75, 0.9);
  }
  .bp4-overlay-exit {
    filter: blur(0);
    opacity: 1;
  }
  .bp4-overlay-exit-active {
    filter: blur(20px);
    opacity: 0.2;
    transition:
      filter 0.2s cubic-bezier(0.4, 1, 0.75, 0.9),
      opacity 0.2s cubic-bezier(0.4, 1, 0.75, 0.9);
  }
`;

const containerStyles = css`
  position: fixed;
  filter: blur(0);
  opacity: 1;
  background-color: var(--color-universal-search-background);
  border-radius: 3px;
  box-shadow:
    0 0 0 1px rgba(16, 22, 26, 0.1),
    0 4px 8px rgba(16, 22, 26, 0.2),
    0 18px 46px 6px rgba(16, 22, 26, 0.2);
  left: calc(50% - 250px);
  top: 20vh;
  width: 500px;
  z-index: 20;

  .bp4-input-group {
    .bp4-icon {
      margin: 16px;
      color: var(--color-universal-search-icon);

      svg {
        stroke: currentColor;
        fill: none;
        fill-rule: evenodd;
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-width: 2;
        --text-opacity: 1;
      }
    }
  }

  .bp4-input-group .bp4-input {
    border: 0;
    box-shadow: 0 0 0 0;
    height: 50px;
    line-height: 50px;
    font-size: 20px;
  }
  .bp4-input-group.bp4-large .bp4-input:not(:first-child) {
    padding-left: 50px !important;
  }
  .bp4-input-group.bp4-large .bp4-input:not(:last-child) {
    padding-right: 130px !important;
  }

  .bp4-menu {
    border-top: 1px solid var(--color-universal-search-menu-border);
    max-height: calc(60vh - 20px);
    overflow: auto;

    .bp4-menu-item {
      .bp4-text-muted {
        font-size: 12px;

        .bp4-icon {
          color: var(--bp4-gray-600);
        }
      }
      &.bp4-intent-primary {
        &.bp4-active {
          background-color: var(--bp4-blue-100);
          color: var(--bp4-dark-gray-800);

          .bp4-menu-item-label {
            color: var(--bp4-gray-600);
          }
        }
      }

      &-label {
        flex-direction: row;
        text-align: right;
      }
    }
  }

  .bp4-input-action {
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
  }
`;

const inputRightElementsStyles = css`
  display: flex;
  margin: 10px;

  .bp4-spinner {
    margin-right: 6px;
  }
`;

const footerStyles = css`
  padding: 12px 12px;
  border-top: 1px solid var(--color-universal-search-footer-divider);
`;

const actionBaseStyles = css`
  &:not(:first-of-type) {
    margin-left: 14px;
  }

  .bp4-tag {
    background: var(--color-universal-search-tag-background);
    color: var(--color-universal-search-tag-text);
  }
`;

const actionArrowsStyles = css`
  &:not(:first-of-type) {
    margin-left: 14px;
  }

  .bp4-tag {
    background: var(--color-universal-search-tag-background);
    color: var(--color-universal-search-tag-text);
    padding: 0;
    text-align: center;
    line-height: 16px;
    margin-left: 4px;

    svg {
      fill: var(--color-universal-search-tag-text);
      height: 100%;
      display: block;
      width: 100%;
      padding: 2px;
    }
  }
`;

// UniversalSearchInputRightElements props
interface UniversalSearchInputRightElementsProps {
  /** Callback when search type changes */
  onSearchTypeChange?: (option: SearchTypeOption) => void;
}

/**
 * Universal search input action.
 */
function UniversalSearchInputRightElements({
  onSearchTypeChange,
}: UniversalSearchInputRightElementsProps) {
  const { isLoading, searchType, searchTypeOptions } =
    useUniversalSearchContext();

  // Find the currently selected item object.
  const selectedItem = searchTypeOptions.find(
    (item) => item.key === searchType,
  );

  // Handle search type option change.
  const handleSearchTypeChange = (option: SearchTypeOption) => {
    onSearchTypeChange?.(option);
  };

  // Item renderer for the select dropdown.
  const itemRenderer: ItemRenderer<SearchTypeOption> = (
    item,
    { handleClick },
  ) => {
    return <MenuItem text={item.label} key={item.key} onClick={handleClick} />;
  };

  return (
    <x.div display="flex" m="10px" className={inputRightElementsStyles}>
      <If condition={isLoading}>
        <Spinner tagName="div" intent={Intent.NONE} size={18} />
      </If>

      <Select<SearchTypeOption>
        items={searchTypeOptions}
        itemRenderer={itemRenderer}
        onItemSelect={handleSearchTypeChange}
        selectedValue={selectedItem?.key}
        valueAccessor={'key'}
        labelAccessor={'label'}
        filterable={false}
        popoverProps={{
          minimal: true,
          captureDismiss: true,
        }}
        input={({ activeItem }) => (
          <Button minimal={true} text={activeItem?.label} />
        )}
      />
    </x.div>
  );
}

// QueryList renderer props
interface QueryListRendererProps {
  /** Current query string */
  query: string;
  /** Callback when query changes */
  handleQueryChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  /** Item list element */
  itemList: ReactNode;
  /** Class name */
  className?: string;
  /** Handle key down */
  handleKeyDown?: (event: KeyboardEvent<HTMLDivElement>) => void;
  /** Handle key up */
  handleKeyUp?: (event: KeyboardEvent<HTMLDivElement>) => void;
}

// UniversalSearchQueryList props
interface UniversalSearchQueryListProps {
  /** Whether the search is open */
  isOpen: boolean;
  /** Whether the search is loading */
  isLoading: boolean;
  /** Callback when search type changes */
  onSearchTypeChange?: (option: SearchTypeOption) => void;
  /** Current search type */
  searchType: ResourceType;
  /** Items to display */
  items: UniversalSearchItem[];
  /** Renderer for items */
  itemRenderer?: ItemRenderer<UniversalSearchItem>;
  /** Callback when an item is selected */
  onItemSelect?: (item: UniversalSearchItem, event?: any) => void;
  /** Current query string */
  query: string;
  /** Callback when query changes */
  onQueryChange?: (query: string) => void;
}

/**
 * Universal search query list.
 */
function UniversalSearchQueryList({
  isOpen,
  isLoading,
  onSearchTypeChange,
  ...restProps
}: UniversalSearchQueryListProps) {
  return (
    <QueryList<UniversalSearchItem>
      {...(restProps as any)}
      initialContent={null}
      renderer={(listProps: QueryListRendererProps) => (
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
    <x.div display="flex">
      <x.div className={actionBaseStyles}>
        <Tag>ENTER</Tag>
        <x.span ml="6px">{intl.get('universal_search.enter_text')}</x.span>
      </x.div>

      <x.div className={actionBaseStyles}>
        <Tag>ESC</Tag>{' '}
        <x.span ml="6px">{intl.get('universal_search.close_text')}</x.span>
      </x.div>

      <x.div className={actionArrowsStyles}>
        <Tag>
          <Icon icon={'arrow-up-24'} iconSize={16} />
        </Tag>
        <Tag>
          <Icon icon={'arrow-down-24'} iconSize={16} />
        </Tag>
        <x.span ml="6px">{intl.get('universal_seach.navigate_text')}</x.span>
      </x.div>
    </x.div>
  );
}

// UniversalSearchBar props
interface UniversalSearchBarProps extends QueryListRendererProps {
  /** Whether the search is open */
  isOpen: boolean;
  /** Callback when search type changes */
  onSearchTypeChange?: (option: SearchTypeOption) => void;
}

/**
 * Universal search input bar with items list.
 */
function UniversalSearchBar({
  isOpen,
  onSearchTypeChange,
  ...listProps
}: UniversalSearchBarProps) {
  const { handleKeyDown, handleKeyUp } = listProps;
  const handlers = isOpen
    ? { onKeyDown: handleKeyDown, onKeyUp: handleKeyUp }
    : {};

  return (
    <x.div {...handlers}>
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
        autoFocus={true}
      />
      {listProps.itemList}
    </x.div>
  );
}

// UniversalSearch props
export interface UniversalSearchProps {
  /** Default search resource type */
  defaultSearchResource?: ResourceType;
  /** Controlled search resource type */
  searchResource?: ResourceType;
  /** Overlay props */
  overlayProps?: OverlayProps;
  /** Whether the search overlay is open */
  isOpen: boolean;
  /** Whether the search is loading */
  isLoading: boolean;
  /** Callback when search type changes */
  onSearchTypeChange?: (resource: SearchTypeOption) => void;
  /** Items to display */
  items: UniversalSearchItem[];
  /** Available search type options */
  searchTypeOptions: SearchTypeOption[];
  /** Renderer for items */
  itemRenderer?: ItemRenderer<UniversalSearchItem>;
  /** Callback when an item is selected */
  onItemSelect?: (item: UniversalSearchItem, event?: any) => void;
  /** Current query string */
  query: string;
  /** Callback when query changes */
  onQueryChange?: (query: string) => void;
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
}: UniversalSearchProps) {
  // Search type state.
  const [searchType, setSearchType] = React.useState<ResourceType>(
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
  const handleSearchTypeChange = (searchTypeResource: SearchTypeOption) => {
    setSearchType(searchTypeResource.key);
    onSearchTypeChange?.(searchTypeResource);
  };
  // Filters query list items based on the given search type.
  const filteredItems = filterItemsByResourceType(items, searchType);

  return (
    <Overlay
      hasBackdrop={true}
      isOpen={isOpen}
      className={overlayStyles}
      {...overlayProps}
    >
      <UniversalSearchProvider
        isLoading={isLoading}
        searchType={searchType}
        defaultSearchResource={defaultSearchResource}
        searchTypeOptions={searchTypeOptions}
      >
        <x.div className={containerStyles}>
          <UniversalSearchQueryList
            isOpen={isOpen}
            isLoading={isLoading}
            searchType={searchType}
            onSearchTypeChange={handleSearchTypeChange}
            {...queryListProps}
            items={filteredItems}
          />
          <x.div className={footerStyles}>
            <UniversalQuerySearchActions />
          </x.div>
        </x.div>
      </UniversalSearchProvider>
    </Overlay>
  );
}
