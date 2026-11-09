import { MenuItem } from '@blueprintjs/core';
import { ItemRenderer, ItemPredicate } from '@blueprintjs/select';
import React, { useCallback, useMemo, ComponentType } from 'react';
import intl from 'react-intl-universal';
import type { ItemRestrictType } from './ItemsSelect';
import type { Item } from '@bigcapital/sdk-ts';
import type { SelectOptionProps } from '@blueprintjs-formik/select';
import { FSuggest, Suggest, FormattedMessage as T } from '@/components';
import { DRAWERS } from '@/constants/drawers';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';

type ItemItemRenderer = ItemRenderer<ItemSuggestModel>;
type ItemItemPredicate = ItemPredicate<ItemSuggestModel>;

// Create new item renderer.
const createNewItemRenderer = (
  query: string,
  active: boolean,
  handleClick: (event: React.MouseEvent<HTMLElement>) => void,
): React.ReactElement => {
  return (
    <MenuItem
      icon="add"
      text={intl.get('list.create', { value: `"${query}"` })}
      active={active}
      shouldDismissPopover={false}
      onClick={handleClick}
    />
  );
};

// Create new item from the given query string.
const createNewItemFromQuery = (name: string): Partial<ItemSuggestModel> => ({
  name,
});

// Filters items.
const filterItemsPredicater: ItemItemPredicate = (
  query: string,
  item: ItemSuggestModel,
  _index?: number,
  exactMatch?: boolean,
): boolean => {
  const normalizedTitle = (item.name ?? '').toLowerCase();
  const normalizedQuery = query.toLowerCase();

  if (exactMatch) {
    return normalizedTitle === normalizedQuery;
  }
  return `${normalizedTitle} ${item.code ?? ''}`.indexOf(normalizedQuery) >= 0;
};

// Item renderer.
const itemRenderer: ItemItemRenderer = (
  item: ItemSuggestModel,
  { handleClick, modifiers },
): React.ReactElement | null => {
  if (!modifiers.matchesPredicate) {
    return null;
  }
  return (
    <MenuItem
      active={modifiers.active}
      disabled={modifiers.disabled}
      label={item.code}
      key={item.id}
      text={item.name}
      onClick={handleClick}
    />
  );
};

// Input value renderer.
const inputValueRenderer = (item: ItemSuggestModel | null): string => {
  if (item) {
    return item.name?.toString() ?? '';
  }
  return '';
};

export interface ItemSuggestModel extends Partial<Item>, SelectOptionProps {}

interface ItemsSuggestOwnProps {
  // #withDrawerActions
  openDrawer: (name: string, payload?: any) => void;

  // #ownProps
  items: ItemSuggestModel[];
  defaultSelectText?: string;
  sellable?: boolean;
  purchasable?: boolean;
  restrictType?: ItemRestrictType;
  allowCreate?: boolean;
}

type ProvidedSuggestProps =
  | 'items'
  | 'itemPredicate'
  | 'itemRenderer'
  | 'inputValueRenderer'
  | 'onCreateItemSelect'
  | 'valueAccessor'
  | 'textAccessor'
  | 'labelAccessor'
  | 'resetOnClose'
  | 'createNewItemRenderer'
  | 'createNewItemFromQuery';

type ComponentProps<C> = C extends ComponentType<infer P> ? P : never;

function withItemsSuggestLogic<C extends ComponentType<any>>(
  Component: C,
): ComponentType<
  ItemsSuggestOwnProps & Omit<ComponentProps<C>, ProvidedSuggestProps>
> {
  return function ItemsSuggestLogic({
    openDrawer,
    items,
    defaultSelectText = 'Select item',
    sellable = false,
    purchasable = false,
    restrictType,
    allowCreate,
    ...suggestProps
  }: ItemsSuggestOwnProps & Omit<ComponentProps<C>, ProvidedSuggestProps>) {
    const filteredItems = useMemo(() => {
      return items.filter((item) => {
        if (sellable && !item.sellable) return false;
        if (purchasable && !item.purchasable) return false;
        if (restrictType && item.type !== restrictType) return false;
        return true;
      });
    }, [items, sellable, purchasable, restrictType]);

    const handleCreateItemSelect = useCallback(
      (item: ItemSuggestModel | Partial<ItemSuggestModel>) => {
        if (!('id' in item) || !item.id) {
          openDrawer(DRAWERS.QUICK_CREATE_ITEM);
        }
      },
      [openDrawer],
    );

    const maybeCreateNewItemRenderer = allowCreate
      ? createNewItemRenderer
      : undefined;
    const maybeCreateNewItemFromQuery = allowCreate
      ? createNewItemFromQuery
      : undefined;

    const processedSuggestProps = {
      items: filteredItems,
      noResults: <MenuItem disabled={true} text={<T id={'no_results'} />} />,
      itemRenderer,
      itemPredicate: filterItemsPredicater,
      inputValueRenderer,
      onCreateItemSelect: handleCreateItemSelect,
      valueAccessor: 'id' as const,
      textAccessor: 'name' as const,
      labelAccessor: 'code' as const,
      inputProps: { placeholder: defaultSelectText },
      resetOnClose: true,
      popoverProps: { minimal: true, boundary: 'window' as const },
      createNewItemRenderer: maybeCreateNewItemRenderer,
      createNewItemFromQuery: maybeCreateNewItemFromQuery,
      createNewItemPosition: 'top' as const,
      ...suggestProps,
    } as ComponentProps<C>;

    return <Component {...processedSuggestProps} />;
  };
}

const ItemsSuggestWithLogic = withItemsSuggestLogic(Suggest);
const FItemsSuggestWithLogic = withItemsSuggestLogic(FSuggest);

export const ItemsSuggest = withDrawerActions(ItemsSuggestWithLogic);
export const FItemsSuggest = withDrawerActions(FItemsSuggestWithLogic);
