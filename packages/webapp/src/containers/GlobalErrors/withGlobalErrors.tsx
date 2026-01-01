// @ts-nocheck
import { connect } from 'react-redux';


const mapStateToProps = (state) => {
  return {
    globalErrors: state.globalErrors.data,
  };
};

export const withGlobalErrors = connect(mapStateToProps);