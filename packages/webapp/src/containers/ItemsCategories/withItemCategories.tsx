import { connect } from 'react-redux';
import type { MapState } from '@/containers/hoc.types';
import { getItemsCategoriesTableStateFactory } from '@/store/item-categories/items-categories.selectors';
import { ApplicationState } from '@/store/reducers';

export interface WithItemCategoriesProps {
  itemsCategoriesTableState: ReturnType<
    ReturnType<typeof getItemsCategoriesTableStateFactory>
  >;
}

export const withItemCategories = <
  Props extends { location?: { search: string } },
>(
  mapState?: MapState<WithItemCategoriesProps, Props>,
) => {
  const getItemsCategoriesTableState = getItemsCategoriesTableStateFactory();

  const mapStateToProps = (state: ApplicationState, props: Props) => {
    const mapped: WithItemCategoriesProps = {
      itemsCategoriesTableState: getItemsCategoriesTableState(state, props),
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};
