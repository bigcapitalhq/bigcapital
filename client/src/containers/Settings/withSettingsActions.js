import { connect } from 'react-redux';
import {
  FetchOptions,
  submitOptions,
} from 'store/settings/settings.actions';

export const mapDispatchToProps = (dispatch) => ({
  requestSubmitOptions: (form) => dispatch(submitOptions({ form })),
  requestFetchOptions: () => dispatch(FetchOptions({})),
});

export default connect(null, mapDispatchToProps);
