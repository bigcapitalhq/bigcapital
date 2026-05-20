// @ts-nocheck
import { connect } from 'react-redux';
import { setGlobalErrors } from '@/store/global-errors/global-errors.actions';

export const mapDispatchToProps = (dispatch) => ({
  globalErrorsSet: (errors) => dispatch(setGlobalErrors(errors)),
});

export const withGlobalErrorsActions = connect(null, mapDispatchToProps);
