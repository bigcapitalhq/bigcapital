// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { Classes, Position } from '@blueprintjs/core';
import { CLASSES } from 'common/classes';
import classNames from 'classnames';
import {
  FFormGroup,
  FInputGroup,
  FDateInput,
  FTextArea,
  FieldRequiredHint,
  FormattedMessage as T,
} from 'components';
import { ProjectSelect, TaskSelect } from '../../components';
import { momentFormatter } from 'utils';

/**
 * Time entry form fields.
 * @returns
 */
function TimeEntryFormFields() {
  return (
    <div className={Classes.DIALOG_BODY}>
      {/*------------ Project -----------*/}
      <FFormGroup
        name={'projectId'}
        label={<T id={'time_entry.dialog.project'} />}
        labelInfo={<FieldRequiredHint />}
        className={classNames('form-group--select-list', Classes.FILL)}
      >
        <ProjectSelect
          name={'projectId'}
          projects={[
            { id: '1', name: 'Project 1' },
            { id: '2', name: 'Project 2' },
          ]}
          popoverProps={{ minimal: true }}
        />
      </FFormGroup>
      {/*------------ Task -----------*/}
      <FFormGroup
        name={'taskId'}
        label={<T id={'time_entry.dialog.task'} />}
        labelInfo={<FieldRequiredHint />}
        className={classNames('form-group--select-list', Classes.FILL)}
      >
        <TaskSelect
          name={'taskId'}
          tasks={[
            { id: '1', name: 'Task 1' },
            { id: '2', name: 'Task 2' },
          ]}
          popoverProps={{ minimal: true }}
        />
      </FFormGroup>
      {/*------------ Description -----------*/}
      <FFormGroup
        name={'description'}
        label={intl.get('time_entry.dialog.description')}
        className={'form-group--description'}
      >
        <FTextArea name={'description'} />
      </FFormGroup>
      {/*------------ Duration -----------*/}
      <FFormGroup
        label={intl.get('time_entry.dialog.duration')}
        name={'duration'}
        labelInfo={<FieldRequiredHint />}
      >
        <FInputGroup name="duration" />
      </FFormGroup>
      {/*------------ Date -----------*/}
      <FFormGroup
        label={intl.get('time_entry.dialog.date')}
        name={'date'}
        labelInfo={<FieldRequiredHint />}
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
    </div>
  );
}

export default TimeEntryFormFields;
