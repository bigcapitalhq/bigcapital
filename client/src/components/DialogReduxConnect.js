import React from 'react';
import { connect } from 'react-redux';
import { isDialogOpen, getDialogPayload } from 'store/dashboard/dashboard.selectors';

export default (Dialog) => {
  function DialogReduxConnect(props) {
    return (<Dialog {...props} />);
  };

  const mapStateToProps = (state, props) => {
    return {
      isOpen: isDialogOpen(state, props),
      payload: getDialogPayload(state, props),
    };
  };

  return connect(
    mapStateToProps,
  )(DialogReduxConnect);
}