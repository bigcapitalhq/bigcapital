import { MenuItem } from '@blueprintjs/core';
import { ItemRenderer, ItemPredicate } from '@blueprintjs/select';
import React, { useCallback, useMemo, ComponentType } from 'react';
import intl from 'react-intl-universal';
import type { Item } from '@bigcapital/sdk-ts';
import type { SelectOptionProps } from '@blueprintjs-formik/select';
import type { ItemRestrictType } from './ItemsSelect';
import { FMultiSelect, MultiSelect } from '@/components/Forms';
import { FormattedMessage as T } from '@/components';
import { DRAWERS } from '@/constants/drawers';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';

type ItemItemRenderer = ItemRenderer<ItemMultiSelectModel>;
type ItemItemPredicate = ItemPredicate<ItemMultiSelectModel>;

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
const createNewItemFromQuery = (
  name: string,
): Partial<ItemMultiSelectModel> => ({
  name,
});

// Filters items.
const filterItemsPredicater: ItemItemPredicate = (
  query: string,
  item: ItemMultiSelectModel,
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
  item: ItemMultiSelectModel,
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

export interface ItemMultiSelectModel
  extends Partial<Item>,
    SelectOptionProps {}

interface ItemsMultiSelectOwnProps {
  // #withDrawerActions
  openDrawer: (name: string, payload?: any) => void;

  // #ownProps
  items?: ItemMultiSelectModel[];
  sellable?: boolean;
  purchasable?: boolean;
  restrictType?: ItemRestrictType;
  allowCreate?: boolean;
}

type ProvidedMultiSelectProps =
  | 'items'
  | 'itemRenderer'
  | 'itemPredicate'
  | 'onCreateItemSelect'
  | 'valueAccessor'
  | 'textAccessor'
  | 'labelAccessor'
  | 'tagAccessor'
  | 'resetOnSelect'
  | 'popoverProps'
  | 'createNewItemRenderer'
  | 'createNewItemFromQuery';

type ComponentProps<C> = C extends ComponentType<infer P> ? P : never;

function withItemsMultiSelectLogic<C extends ComponentType<any>>(
  Component: C,
): ComponentType<
  ItemsMultiSelectOwnProps & Omit<ComponentProps<C>, ProvidedMultiSelectProps>
> {
  return function ItemsMultiSelectLogic({
    openDrawer,
    items = [],
    sellable = false,
    purchasable = false,
    restrictType,
    allowCreate,
    ...rest
  }: ItemsMultiSelectOwnProps &
    Omit<ComponentProps<C>, ProvidedMultiSelectProps>) {
    const filteredItems = useMemo(() => {
      return items.filter((item) => {
        if (sellable && !item.sellable) return false;
        if (purchasable && !item.purchasable) return false;
        if (restrictType && item.type !== restrictType) return false;
        return true;
      });
    }, [items, sellable, purchasable, restrictType]);

    const handleCreateItemSelect = useCallback(
      (item: ItemMultiSelectModel | Partial<ItemMultiSelectModel>) => {
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

    const processedMultiSelectProps = {
      items: filteredItems,
      noResults: <MenuItem disabled={true} text={<T id={'no_results'} />} />,
      itemRenderer,
      itemPredicate: filterItemsPredicater,
      onCreateItemSelect: handleCreateItemSelect,
      valueAccessor: 'id' as const,
      textAccessor: 'name' as const,
      labelAccessor: 'code' as const,
      tagAccessor: 'name' as const,
      fill: true,
      resetOnSelect: true,
      popoverProps: { minimal: true },
      createNewItemRenderer: maybeCreateNewItemRenderer,
      createNewItemFromQuery: maybeCreateNewItemFromQuery,
      ...rest,
    } as ComponentProps<C>;

    return <Component {...processedMultiSelectProps} />;
  };
}

const ItemsMultiSelectWithLogic = withItemsMultiSelectLogic(MultiSelect);
const FItemsMultiSelectWithLogic = withItemsMultiSelectLogic(FMultiSelect);

export const ItemsMultiSelect = withDrawerActions(ItemsMultiSelectWithLogic);
export const FItemsMultiSelect = withDrawerActions(FItemsMultiSelectWithLogic);
