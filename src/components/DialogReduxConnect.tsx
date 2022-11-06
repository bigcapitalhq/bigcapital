// @ts-nocheck
import { connect } from 'react-redux';
import {
  isDialogOpenFactory,
  getDialogPayloadFactory,
} from '@/store/dashboard/dashboard.selectors';

export default (mapState) => {
  const isDialogOpen = isDialogOpenFactory();
  const getDialogPayload = getDialogPayloadFactory();

  const mapStateToProps = (state, props) => {
    const mapped = {
      isOpen: isDialogOpen(state, props),
      payload: getDialogPayload(state, props),
    };
    return mapState ? mapState(mapped) : mapped;
  };
  return connect(mapStateToProps);
};
