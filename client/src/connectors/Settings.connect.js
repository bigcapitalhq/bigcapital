import { connect } from 'react-redux';
import {
  FetchOption,
  FetchOptions,
  submitOptions,
} from 'store/settings/settings.actions';


export const mapStateToProps = (state, props) => {
  return {
    organizationSettings: state.settings.data.organization,
  };
};

export const mapDispatchToProps = (dispatch) => ({
  requestSubmitOptions: (form) => dispatch(submitOptions({ form })),
  requestFetchOptions: () => dispatch(FetchOptions({})),
});

export default connect(mapStateToProps, mapDispatchToProps);
