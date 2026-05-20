// @ts-nocheck
import { connect } from 'react-redux';
import { CLOSE_ALERT, OPEN_ALERT } from '@/store/types';;

export const mapStateToProps = (state, props) => {
  return {};
};

export const mapDispatchToProps = (dispatch) => ({
  openAlert: (name, payload) => dispatch({ type: OPEN_ALERT, name, payload }),
  closeAlert: (name, payload) => dispatch({ type: CLOSE_ALERT, name, payload }),
});

export const withAlertActions = connect(null, mapDispatchToProps);