// @ts-nocheck
import React from 'react';
import { Button, Intent } from '@blueprintjs/core';

import WorkflowIcon from './WorkflowIcon';
import { FormattedMessage as T } from '@/components';

import withOrganizationActions from '@/containers/Organization/withOrganizationActions';
import { compose } from '@/utils';

import '@/style/pages/Setup/Congrats.scss';

/**
 * Setup congrats page.
 */
function SetupCongratsPage({ setOrganizationSetupCompleted }) {
  const [isReloading, setIsReloading] = React.useState(false);

  const handleBtnClick = () => {
    setIsReloading(true);
    window.location.reload();
  };

  return (
    <div className="setup-congrats">
      <div className="setup-congrats__workflow-pic">
        <WorkflowIcon width="280" height="330" />
      </div>

      <div className="setup-congrats__text">
        <h1>
          <T id={'setup.congrats.title'} />
        </h1>

        <p className="paragraph">
          <T id={'setup.congrats.description'} />
        </p>

        <Button
          intent={Intent.PRIMARY}
          type="submit"
          loading={isReloading}
          onClick={handleBtnClick}
        >
          <T id={'setup.congrats.go_to_dashboard'} />
        </Button>
      </div>
    </div>
  );
}

export default compose(withOrganizationActions)(SetupCongratsPage);
