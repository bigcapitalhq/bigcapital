// @ts-nocheck
import { connect } from 'react-redux';
import t from '@/store/types';

export const mapStateToProps = (state, props) => {
  return {};
};

export const mapDispatchToProps = (dispatch) => ({
  openDialog: (name, payload) =>
    dispatch({ type: t.OPEN_DIALOG, name, payload }),
  closeDialog: (name, payload) =>
    dispatch({ type: t.CLOSE_DIALOG, name, payload }),
});

export default connect(null, mapDispatchToProps);
