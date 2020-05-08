import {connect} from 'react-redux';
import {
  getViewItem,
  getViewMeta,
} from 'store/customViews/customViews.selectors';


export const mapStateToProps = (state, props) => {
  const { viewId } = props;

  return {
    viewMeta: getViewMeta(state, viewId),
    viewItem: getViewItem(state, viewId),
  };
};

export default connect(mapStateToProps);