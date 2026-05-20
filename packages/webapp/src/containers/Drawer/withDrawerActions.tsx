// @ts-nocheck
import { connect } from 'react-redux';
import { CLOSE_DRAWER, OPEN_DRAWER } from '@/store/types';;

export const mapStateToProps = (state, props) => {
  return {};
};

export const mapDispatchToProps = (dispatch) => ({
  openDrawer: (name, payload) =>
    dispatch({ type: OPEN_DRAWER, name, payload }),
  closeDrawer: (name, payload) =>
    dispatch({ type: CLOSE_DRAWER, name, payload }),
});

export const withDrawerActions = connect(null, mapDispatchToProps);
