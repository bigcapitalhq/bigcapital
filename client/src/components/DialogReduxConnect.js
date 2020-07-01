import React from 'react';
import { connect } from 'react-redux';
import {
  isDialogOpenFactory,
  getDialogPayloadFactory,
} from 'store/dashboard/dashboard.selectors';

export default (mapState, dialogName) => {
  const isDialogOpen = isDialogOpenFactory(dialogName);
  const getDialogPayload = getDialogPayloadFactory(dialogName);

  const mapStateToProps = (state, props) => {
    const mapped = {
      dialogName,
      isOpen: isDialogOpen(state, props),
      payload: getDialogPayload(state, props),
    };
    return mapState ? mapState(mapped) : mapped;
  };
  return connect(mapStateToProps);
};
