// @ts-nocheck
import {connect} from 'react-redux';
import {
  getViewItemFactory,
  getViewMetaFactory,
} from '@/store/customViews/customViews.selectors';

export default () => {
  const getViewItem = getViewItemFactory();
  const getViewMeta = getViewMetaFactory();

  const mapStateToProps = (state, props) => ({
    viewMeta: getViewMeta(state, props),
    viewItem: getViewItem(state, props),
  });
  return connect(mapStateToProps);
};