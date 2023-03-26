// @ts-nocheck
import React from 'react';
import { Button, Intent } from '@blueprintjs/core';
import { EmptyStatus, Can, FormattedMessage as T } from '@/components';
import { ProjectAction, AbilitySubject } from '@/constants/abilityOption';
import withDialogActions from '@/containers/Dialog/withDialogActions';

import { compose } from '@/utils';

function ProjectsEmptyStatus({
  // #withDialogActions
  openDialog,
}) {
  // Handle new project button click.
  const handleNewProjectClick = () => {
    openDialog('project-form', {});
  };

  return (
    <EmptyStatus
      title={<T id="projects.empty_status.title" />}
      description={
        <p>
          <T id="projects.empty_status.description" />
        </p>
      }
      action={
        <React.Fragment>
          <Can I={ProjectAction.Create} a={AbilitySubject.Project}>
            <Button
              intent={Intent.PRIMARY}
              large={true}
              onClick={handleNewProjectClick}
            >
              <T id="projects.empty_status.action" />
            </Button>
            <Button intent={Intent.NONE} large={true}>
              <T id={'learn_more'} />
            </Button>
          </Can>
        </React.Fragment>
      }
    />
  );
}

export default compose(withDialogActions)(ProjectsEmptyStatus);
