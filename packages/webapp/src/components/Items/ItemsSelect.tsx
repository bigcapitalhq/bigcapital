import { useMemo, ComponentType } from 'react';
import type { Item } from '@bigcapital/sdk-ts';
import type { SelectOptionProps } from '@blueprintjs-formik/select';
import { BPSelect, FSelect } from '@/components/Forms';

export type ItemRestrictType = 'inventory' | 'non-inventory' | 'service';

export interface ItemSelectModel extends Partial<Item>, SelectOptionProps {}

interface ItemsSelectOwnProps {
  items: ItemSelectModel[];
  sellable?: boolean;
  purchasable?: boolean;
  restrictType?: ItemRestrictType;
}

type ProvidedSelectProps =
  | 'items'
  | 'valueAccessor'
  | 'textAccessor'
  | 'labelAccessor'
  | 'popoverProps'
  | 'placeholder';

type ComponentProps<C> = C extends ComponentType<infer P> ? P : never;

function withItemsSelectLogic<C extends ComponentType<any>>(
  Component: C,
): ComponentType<
  ItemsSelectOwnProps & Omit<ComponentProps<C>, ProvidedSelectProps>
> {
  return function ItemsSelectLogic({
    items,
    sellable = false,
    purchasable = false,
    restrictType,
    ...rest
  }: ItemsSelectOwnProps & Omit<ComponentProps<C>, ProvidedSelectProps>) {
    const filteredItems = useMemo(() => {
      return items.filter((item) => {
        if (sellable && !item.sellable) return false;
        if (purchasable && !item.purchasable) return false;
        if (restrictType && item.type !== restrictType) return false;
        return true;
      });
    }, [items, sellable, purchasable, restrictType]);

    const processedSelectProps = {
      items: filteredItems,
      valueAccessor: 'id' as const,
      textAccessor: 'name' as const,
      labelAccessor: 'code' as const,
      placeholder: 'Click to select an item.',
      popoverProps: { minimal: true },
      ...rest,
    } as ComponentProps<C>;

    return <Component {...processedSelectProps} />;
  };
}

const ItemsSelectWithLogic = withItemsSelectLogic(BPSelect);
const FItemsSelectWithLogic = withItemsSelectLogic(FSelect);

export const ItemsSelect = ItemsSelectWithLogic;
export const FItemsSelect = FItemsSelectWithLogic;
