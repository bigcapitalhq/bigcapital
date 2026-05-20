// @ts-nocheck
import { connect } from 'react-redux';
import { CLOSE_DIALOG, OPEN_DIALOG } from '@/store/types';;

export const mapStateToProps = (state, props) => {};

export const mapDispatchToProps = (dispatch) => ({
  openDialog: (name, payload) =>
    dispatch({ type: OPEN_DIALOG, name, payload }),
  closeDialog: (name, payload) =>
    dispatch({ type: CLOSE_DIALOG, name, payload }),
});

export const withUserPreferences = connect(null, mapDispatchToProps);
