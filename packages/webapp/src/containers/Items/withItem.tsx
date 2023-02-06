// @ts-nocheck
import { connect } from 'react-redux';
import { getItemById } from '@/store/items/items.reducer';

export default (mapState) => {
  const mapStateToProps = (state, props) => {
    const mapped = {
      item: getItemById(state, props.itemId),
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };

  return connect(mapStateToProps);
};
