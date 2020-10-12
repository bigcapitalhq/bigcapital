import React, { useEffect } from 'react';
import { useQuery } from 'react-query';
import { withWizard } from 'react-albus'

import withOrganizationActions from 'containers/Organization/withOrganizationActions';
import withOrganization from 'containers/Organization/withOrganization'

import { compose } from 'utils';

/**
 * Setup initializing step form.
 */
function SetupInitializingForm({

  // #withOrganizationActions
  requestOrganizationBuild,

  wizard: { next },
}) {
  const { isSuccess } = useQuery(
    ['build-tenant'], () => requestOrganizationBuild(),
  );

  useEffect(() => {
    if (isSuccess) {
      next();
    }
  }, [isSuccess, next]);

  return (
    <div class="setup-initializing-form">
      <h1>You organization is initializin...</h1>
    </div>
  );
}

export default compose(
  withOrganizationActions,
  withWizard,
)(SetupInitializingForm);