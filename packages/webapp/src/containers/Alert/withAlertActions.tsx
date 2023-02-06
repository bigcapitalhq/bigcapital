// @ts-nocheck
import { connect } from 'react-redux';
import t from '@/store/types';

export const mapStateToProps = (state, props) => {
  return {};
};

export const mapDispatchToProps = (dispatch) => ({
  openAlert: (name, payload) => dispatch({ type: t.OPEN_ALERT, name, payload }),
  closeAlert: (name, payload) => dispatch({ type: t.CLOSE_ALERT, name, payload }),
});

export default connect(null, mapDispatchToProps);