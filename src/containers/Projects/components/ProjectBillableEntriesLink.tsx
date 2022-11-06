// @ts-nocheck
import React from 'react';
import styled from 'styled-components';
import * as R from 'ramda';

import { ButtonLink } from '@/components';
import withDialogActions from '@/containers/Dialog/withDialogActions';

function ProjectBillableEntriesLinkComponent({
  // #ownProps
  children,
  projectId,
  className,

  // #withDialogAction
  openDialog,
}) {
  const handleBillableEntries = (event) => {
    openDialog('project-billable-entries', { projectId });
    event.preventDefault();
  };

  return (
    <BillableEntriesLink className={className} onClick={handleBillableEntries}>
      {children}
    </BillableEntriesLink>
  );
}

export const ProjectBillableEntriesLink = R.compose(withDialogActions)(
  ProjectBillableEntriesLinkComponent,
);

const BillableEntriesLink = styled(ButtonLink)`
  font-size: 11px;
  margin-top: 6px;
`;
