// @ts-nocheck
import { connect } from 'react-redux';
import {
  setOrganizationSetupCompleted,
} from '@/store/organizations/organizations.actions';

const mapDispatchToProps = (dispatch) => ({
  setOrganizationSetupCompleted: (congrats) =>
    dispatch(setOrganizationSetupCompleted(congrats)),
});

export default connect(null, mapDispatchToProps);
