// @ts-nocheck

import React from 'react';
import { useFormikContext } from 'formik';
import { Classes } from '@blueprintjs/core';
import {
  FFormGroup,
  FInputGroup,
  FieldRequiredHint,
  FormattedMessage as T,
} from '@/components';
import { ProjectRowDivider, ProjectEntiresBox } from './components';
import { useProjectBillableEntriesFormContext } from './ProjectBillableEntriesFormProvider';

/**
 * Project billable entries form fields.
 * @returns
 */
export default function ProjectBillableEntriesFormFields() {
  // Formik context.
  const { values } = useFormikContext();

  const { billableEntries } = useProjectBillableEntriesFormContext();

  return (
    <div className={Classes.DIALOG_BODY}>
      {/*------------ Filter by Date -----------*/}
      <FFormGroup
        name={'date'}
        label={<T id={'project_billable_entries.dialog.filter_by_date'} />}
        labelInfo={<FieldRequiredHint />}
      >
        <FInputGroup name="date" placeholder={'Placeholder text'} />
      </FFormGroup>

      <ProjectRowDivider />

      {/*------------ Filter by Type -----------*/}
      <FFormGroup
        name={'type'}
        label={<T id={'project_billable_entries.dialog.filter_by_type'} />}
        labelInfo={<FieldRequiredHint />}
      >
        <FInputGroup name="type" placeholder={'Placeholder Type'} />
      </FFormGroup>

      <ProjectEntiresBox billableEntries={billableEntries} />
    </div>
  );
}
