import React, { useCallback } from 'react';
import { Button, Intent } from '@blueprintjs/core';
import { useHistory } from 'react-router-dom';
import WorkflowIcon from './WorkflowIcon';
import { FormattedMessage as T } from 'components';
import withOrganizationActions from 'containers/Organization/withOrganizationActions';

import 'style/pages/Setup/Congrats.scss';

import { compose } from 'utils';

/**
 * Setup congrats page.
 */
function SetupCongratsPage({ setOrganizationSetupCompleted }) {
  const history = useHistory();

  const handleBtnClick = useCallback(() => {
    setOrganizationSetupCompleted(false);
    history.push('/homepage');
  }, [setOrganizationSetupCompleted, history]);

  return (
    <div class="setup-congrats">
      <div class="setup-congrats__workflow-pic">
        <WorkflowIcon width="280" height="330" />
      </div>

      <div class="setup-congrats__text">
        <h1>
          <T id={'congrats_you_are_ready_to_go'} />
        </h1>

        <p class="paragraph">
          <T id={'it_is_a_long_established_fact_that_a_reader'} />
        </p>

        <Button intent={Intent.PRIMARY} type="submit" onClick={handleBtnClick}>
          <T id={'go_to_dashboard'} />
        </Button>
      </div>
    </div>
  );
}

export default compose(withOrganizationActions)(SetupCongratsPage);
