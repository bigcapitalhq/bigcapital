// @ts-nocheck
import React from 'react';
import styled from 'styled-components';
import { ButtonLink } from '@/components';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { compose } from '@/utils';

function ProjectBillableEntriesLinkComponent({
  // #ownProps
  children,
  projectId,
  className,

  // #withDialogAction
  openDialog,
}: {
  children?: React.ReactNode;
  projectId?: string | number;
  className?: string;
  openDialog: (name: string, payload?: Record<string, unknown>) => void;
}) {
  const handleBillableEntries = (event: React.MouseEvent) => {
    openDialog('project-billable-entries', { projectId });
    event.preventDefault();
  };

  return (
    <BillableEntriesLink className={className} onClick={handleBillableEntries}>
      {children}
    </BillableEntriesLink>
  );
}

export const ProjectBillableEntriesLink = compose(withDialogActions)(
  ProjectBillableEntriesLinkComponent,
);

const BillableEntriesLink = styled(ButtonLink)`
  font-size: 11px;
  margin-top: 6px;
`;
