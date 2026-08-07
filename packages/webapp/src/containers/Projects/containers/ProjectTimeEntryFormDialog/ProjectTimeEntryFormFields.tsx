// @ts-nocheck
import { Classes, Intent, Position } from '@blueprintjs/core';
import classNames from 'classnames';
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import {
  ProjectsSelect,
  ProjectTaskSelect,
  ProjectSelectButton,
} from '../../components';
import { useProjectTimeEntryFormContext } from './ProjectTimeEntryFormProvider';
import { useSetProjectToForm } from './utils';
import {
  If,
  FFormGroup,
  FInputGroup,
  FDateInput,
  FTextArea,
  FieldRequiredHint,
  Stack,
} from '@/components';
import { CLASSES } from '@/constants/classes';
import { momentFormatter } from '@/utils';

/**
 * Project time entry form fields.
 * @returns
 */
export function ProjectTimeEntryFormFields() {
  // time entry form dialog context.
  const { projectTasks, projects, projectId } =
    useProjectTimeEntryFormContext();

  // Sets the project id.
  useSetProjectToForm();

  return (
    <div className={Classes.DIALOG_BODY}>
      <Stack spacing={20}>
        {/*------------ Date -----------*/}
        <FFormGroup
          label={intl.get('project_time_entry.dialog.date')}
          name={'date'}
          className={classNames(CLASSES.FILL, 'form-group--date')}
        >
          <FDateInput
            {...momentFormatter('YYYY/MM/DD')}
            name="date"
            formatDate={(date) => date.toLocaleString()}
            popoverProps={{
              position: Position.BOTTOM,
              minimal: true,
            }}
          />
        </FFormGroup>

        {/*------------ Project -----------*/}
        <FFormGroup
          name={'project_id'}
          label={intl.get('project_time_entry.dialog.project')}
          labelInfo={<FieldRequiredHint />}
          className={classNames('form-group--select-list', Classes.FILL)}
        >
          <ProjectsSelect
            name={'project_id'}
            projects={projects}
            input={ProjectSelectButton}
          />
        </FFormGroup>

        {/*------------ Task -----------*/}
        <FFormGroup
          name={'task_id'}
          label={intl.get('project_time_entry.dialog.task')}
          labelInfo={<FieldRequiredHint />}
          className={classNames('form-group--select-list', Classes.FILL)}
        >
          <ProjectTaskSelect
            name={'task_id'}
            tasks={projectTasks}
            popoverProps={{ minimal: true }}
          />
        </FFormGroup>

        {/*------------ Duration -----------*/}
        <FFormGroup
          label={intl.get('project_time_entry.dialog.duration')}
          name={'duration'}
          labelInfo={<FieldRequiredHint />}
        >
          <DurationInputGroup
            name="duration"
            inputProps={{}}
            placeholder="HH:MM"
          />
        </FFormGroup>

        {/*------------ Description -----------*/}
        <FFormGroup
          name={'description'}
          label={intl.get('project_time_entry.dialog.description')}
          className={'form-group--description'}
        >
          <FTextArea name={'description'} />
        </FFormGroup>
      </Stack>
    </div>
  );
}
const DurationInputGroup = styled(FInputGroup)`
  .bp4-input {
    width: 150px;
  }
`;
