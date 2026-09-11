import { connect } from 'react-redux';
import type { MapState } from '@/containers/hoc.types';
import type { ComponentType } from 'react';
import { getItemsCategoriesTableStateFactory } from '@/store/item-categories/items-categories.selectors';
import { ApplicationState } from '@/store/reducers';

export interface WithItemCategoriesProps {
  itemsCategoriesTableState: ReturnType<
    ReturnType<typeof getItemsCategoriesTableStateFactory>
  >;
  itemsCategoriesSelectedRows: Array<unknown>;
}

export const withItemCategories = <
  Props extends { location?: { search: string } },
  Mapped extends object = WithItemCategoriesProps,
>(
  mapState?: MapState<WithItemCategoriesProps, Props, Mapped>,
) => {
  const getItemsCategoriesTableState = getItemsCategoriesTableStateFactory();

  const mapStateToProps = (state: ApplicationState, props: Props) => {
    const mapped: WithItemCategoriesProps = {
      itemsCategoriesTableState: getItemsCategoriesTableState(state, props),
      itemsCategoriesSelectedRows: state.itemsCategories.selectedRows,
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return function withHOC<P>(
    WrappedComponent: ComponentType<P>,
  ): ComponentType<Omit<P, keyof Mapped>> {
    const Connected = connect(mapStateToProps)(
      WrappedComponent as ComponentType<any>,
    );
    return Connected as unknown as ComponentType<Omit<P, keyof Mapped>>;
  };
};
