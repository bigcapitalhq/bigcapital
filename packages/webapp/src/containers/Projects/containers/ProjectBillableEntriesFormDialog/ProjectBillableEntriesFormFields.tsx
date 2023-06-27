// @ts-nocheck

import React from 'react';
import { useFormikContext } from 'formik';
import { Classes, Position } from '@blueprintjs/core';
import {
  FFormGroup,
  FInputGroup,
  FDateInput,
  FieldRequiredHint,
  FormattedMessage as T,
} from '@/components';
import {
  inputIntent,
  momentFormatter,
  transformDateValue,
  handleDateChange,
} from '@/utils';
import classNames from 'classnames';
import { CLASSES } from '@/constants/classes';
import { ProjectBillableTypeSuggestField } from '../../components';
import { billableTypeOption } from '../common';
import { ProjectRowDivider, BillableEntiresBox } from './components';
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

      <ProjectRowDivider />

      {/*------------ Filter by Type -----------*/}
      <FFormGroup
        name={'billableType'}
        label={<T id={'project_billable_entries.dialog.filter_by_type'} />}
        labelInfo={<FieldRequiredHint />}
      >
        <ProjectBillableTypeSuggestField
          billableType={billableTypeOption}
          // onBillableTypeSelected={()=>}
        />
      </FFormGroup>

      <BillableEntiresBox billableEntries={billableEntries} />
    </div>
  );
}
