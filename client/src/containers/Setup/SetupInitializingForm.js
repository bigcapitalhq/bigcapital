import React, { useEffect } from 'react';
import { useQuery } from 'react-query';
import { withWizard } from 'react-albus'
import { ProgressBar, Intent } from '@blueprintjs/core';

import 'style/pages/Setup/Initializing.scss';

import withOrganizationActions from 'containers/Organization/withOrganizationActions';

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
      <ProgressBar intent={Intent.PRIMARY} value={null} />
      <div className={'setup-initializing-form__title'}>
        <h1>
          {/* You organization is initializin... */}
          It's time to make your accounting really simple!
        </h1>
        <p className={'paragraph'}>
          while we set up your account, please remember to verify your account by
          clicking on the link we sent to yout registered email address
        </p>
      </div>
    </div>
  );
}

export default compose(
  withOrganizationActions,
  withWizard,
)(SetupInitializingForm);