// @ts-nocheck
import { connect } from 'react-redux';
import {
  getItemsCategoriesTableStateFactory,
} from '@/store/itemCategories/ItemsCategories.selectors';

export default (mapState) => {
  const getItemsCategoriesTableState = getItemsCategoriesTableStateFactory();

  const mapStateToProps = (state, props) => {
    const mapped = {  
      itemsCategoriesTableState: getItemsCategoriesTableState(state, props),
    };
    return mapState ? mapState(mapped, state, props) : mapState;
  };
  return connect(mapStateToProps);
};
