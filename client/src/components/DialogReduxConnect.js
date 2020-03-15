import React from 'react';
import { connect } from 'react-redux';

export default (Dialog) => {

  function DialogReduxConnect(props) {
    return (<Dialog {...props} />);
  };

  const mapStateToProps = (state, props) => {
    const dialogs = state.dashboard.dialogs;

    if (dialogs && dialogs.hasOwnProperty['name'] && dialogs[props.name]) {
      const { isOpen, payload } = dialogs[props.name];
      return { isOpen, payload };
    }
  };

  return connect(
    mapStateToProps,
  )(DialogReduxConnect);
}