// @ts-nocheck
import React, { useCallback } from 'react';
import { FormGroup, Intent, Classes } from '@blueprintjs/core';
import classNames from 'classnames';

import { CellType } from '@/constants';
import { ProjectSuggestField } from '@/containers/Projects/components';

/**
 * projects list field cell.
 * @returns
 */
export function ProjectsListFieldCell({
  column: { id },
  row: { index, original },
  payload: { projects, updateData, errors },
}) {
  const handleProjectSelected = useCallback(
    (project) => {
      updateData(index, 'project_id', project.id);
    },
    [updateData, index],
  );

  const error = errors?.[index]?.[id];
  return (
    <FormGroup
      intent={error ? Intent.DANGER : null}
      className={classNames(
        'form-group--select-list',
        'form-group--contacts-list',
        Classes.FILL,
      )}
    >
      <ProjectSuggestField
        projects={projects}
        onProjectSelected={handleProjectSelected}
        selectedProjectId={original?.project_id}
      />
    </FormGroup>
  );
}

ProjectsListFieldCell.cellType = CellType.Field;
