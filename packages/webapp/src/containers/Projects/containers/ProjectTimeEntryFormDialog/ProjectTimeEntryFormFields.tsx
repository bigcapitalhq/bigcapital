// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { Classes, Intent, Position } from '@blueprintjs/core';
import { CLASSES } from '@/constants/classes';
import classNames from 'classnames';
import {
  If,
  FFormGroup,
  FInputGroup,
  FDateInput,
  FTextArea,
  FieldRequiredHint,
  FormattedMessage as T,
  Stack,
} from '@/components';
import { useProjectTimeEntryFormContext } from './ProjectTimeEntryFormProvider';
import {
  ProjectsSelect,
  ProjectTaskSelect,
  ProjectSelectButton,
} from '../../components';
import { momentFormatter } from '@/utils';
import { useSetProjectToForm } from './utils';

/**
 * Project time entry form fields.
 * @returns
 */
function ProjectTimeEntryFormFields() {
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
          label={<T id={'project_time_entry.dialog.project'} />}
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
          label={<T id={'project_time_entry.dialog.task'} />}
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

export default ProjectTimeEntryFormFields;

const DurationInputGroup = styled(FInputGroup)`
  .bp4-input {
    width: 150px;
  }
`;
