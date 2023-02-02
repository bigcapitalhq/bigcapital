// @ts-nocheck
import { connect } from 'react-redux';
import {
  isDrawerOpenFactory,
  getDrawerPayloadFactory,
} from '@/store/dashboard/dashboard.selectors';

export default (mapState) => {
  const isDrawerOpen = isDrawerOpenFactory();
  const getDrawerPayload = getDrawerPayloadFactory();

  const mapStateToProps = (state, props) => {
    const mapped = {
      isOpen: isDrawerOpen(state, props),
      payload: getDrawerPayload(state, props),
    };
    return mapState ? mapState(mapped) : mapped;
  };
  return connect(mapStateToProps);
};
