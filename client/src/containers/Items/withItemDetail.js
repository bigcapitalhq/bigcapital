import { connect } from 'react-redux';
import { getItemById } from 'store/items/items.reducer';

const mapStateToProps = (state, props) => ({
  itemDetail: getItemById(state, props.itemId),
});

export default connect(mapStateToProps);
