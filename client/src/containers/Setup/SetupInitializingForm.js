import React from 'react';
import { useQuery } from 'react-query';

import withOrganizationActions from 'containers/Organization/withOrganizationActions';
import withOrganization from 'containers/Organization/withOrganization'

import { compose } from 'utils';

/**
 * Setup initializing step form.
 */
function SetupInitializingForm({

  // #withOrganizationActions
  requestOrganizationBuild,
}) {
  const requestBuildOrgnization = useQuery(
    ['build-tenant'], () => requestOrganizationBuild(),
  );

  return (
    <div class="setup-initializing-form">
      <h1>You organization is initializin...</h1>
    </div>
  );
}

export default compose(
  withOrganizationActions
)(SetupInitializingForm);