// @ts-nocheck
import { Button } from '@blueprintjs/core';
import { Popover2 } from '@blueprintjs/popover2';
import React from 'react';
import styled from 'styled-components';
import { Icon, FormattedMessage as T } from '@/components';
import { CellType } from '@/constants';
import { ProjectBillableEntries } from '@/containers/Projects/containers/ProjectBillableEntries';

/**
 *
 * @return
 */
export function ProjectBillableEntriesCell() {
  const content = <ProjectBillableEntries />;
  return (
    <Popover2 content={content}>
      <Button
        icon={<Icon icon={'info'} iconSize={14} />}
        className="m12"
        minimal={true}
      />
    </Popover2>
  );
}

ProjectBillableEntriesCell.cellType = CellType.Button;
