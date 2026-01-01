// @ts-nocheck
import { connect } from 'react-redux';
import {
  isAlertOpenFactory,
  getAlertPayloadFactory,
} from '@/store/dashboard/dashboard.selectors';

export const withAlertStoreConnect = (mapState) => {
  const isAlertOpen = isAlertOpenFactory();
  const getAlertPayload = getAlertPayloadFactory();

  const mapStateToProps = (state, props) => {
    const mapped = {
      isOpen: isAlertOpen(state, props),
      payload: getAlertPayload(state, props),
    };
    return mapState ? mapState(mapped) : mapped;
  };
  return connect(mapStateToProps);
}