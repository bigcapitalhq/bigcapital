// @ts-nocheck
import { connect } from 'react-redux';
import {
  getOrganizationByIdFactory,
  isOrganizationReadyFactory,
  isOrganizationBuiltFactory,
  isOrganizationSubscribedFactory,
  isOrganizationCongratsFactory,
  isOrganizationBuildRunningFactory
} from '@/store/organizations/organizations.selectors';

export default (mapState) => {
  const getOrganizationById = getOrganizationByIdFactory();
  const isOrganizationReady = isOrganizationReadyFactory();
  const isOrganizationBuilt = isOrganizationBuiltFactory();

  const isOrganizationSubscribed = isOrganizationSubscribedFactory();
  const isOrganizationCongrats = isOrganizationCongratsFactory();
  const isOrganizationBuildRunning = isOrganizationBuildRunningFactory();

  const mapStateToProps = (state, props) => {
    const mapped = {
      organization: getOrganizationById(state, props),
      isOrganizationReady: isOrganizationReady(state, props),
      isOrganizationInitialized: isOrganizationBuilt(state, props),

      isOrganizationSubscribed: isOrganizationSubscribed(state, props),
      isOrganizationSetupCompleted: isOrganizationCongrats(state, props),
      isOrganizationBuildRunning: isOrganizationBuildRunning(state, props)
    };
    return (mapState) ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};