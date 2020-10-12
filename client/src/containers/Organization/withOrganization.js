import { connect } from 'react-redux';
import {
  getOrganizationByIdFactory,
  isOrganizationReadyFactory,
  isOrganizationSeededFactory,
  isOrganizationBuiltFactory,
  isOrganizationSeedingFactory,
  isOrganizationInitializingFactory,
  isOrganizationSubscribedFactory,
} from 'store/organizations/organizations.selectors';

export default (mapState) => {
  const getOrganizationById = getOrganizationByIdFactory();
  const isOrganizationReady = isOrganizationReadyFactory();

  const isOrganizationSeeded = isOrganizationSeededFactory();
  const isOrganizationBuilt = isOrganizationBuiltFactory();

  const isOrganizationInitializing = isOrganizationInitializingFactory();
  const isOrganizationSeeding = isOrganizationSeedingFactory();

  const isOrganizationSubscribed = isOrganizationSubscribedFactory();

  const mapStateToProps = (state, props) => {
    const mapped = {
      organization: getOrganizationById(state, props),
      isOrganizationReady: isOrganizationReady(state, props),
      isOrganizationSeeded: isOrganizationSeeded(state, props),
      isOrganizationInitialized: isOrganizationBuilt(state, props),
      isOrganizationSeeding: isOrganizationInitializing(state, props),
      isOrganizationInitializing: isOrganizationSeeding(state, props),
      isOrganizationSubscribed: isOrganizationSubscribed(state, props),
    };
    return (mapState) ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};