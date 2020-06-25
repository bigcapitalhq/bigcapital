import {connect} from 'react-redux';
import {
  getViewItem,
  getViewMeta,
} from 'store/customViews/customViews.selectors';


export const mapStateToProps = (state, props) => {
  return {
    viewMeta: getViewMeta(state, props),
    viewItem: getViewItem(state, props),
  };
};

export default connect(mapStateToProps);