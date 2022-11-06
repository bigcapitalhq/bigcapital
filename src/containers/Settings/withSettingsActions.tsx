// @ts-nocheck
import { connect } from 'react-redux';
import {
  FetchOptions,
  submitOptions,
  addSettings
} from '@/store/settings/settings.actions';

export const mapDispatchToProps = (dispatch) => ({
  requestSubmitOptions: (form) => dispatch(submitOptions({ form })),
  requestFetchOptions: () => dispatch(FetchOptions({})),
  addSetting: (group, key, value) => dispatch(addSettings(group, key, value)),
});

export default connect(null, mapDispatchToProps);
