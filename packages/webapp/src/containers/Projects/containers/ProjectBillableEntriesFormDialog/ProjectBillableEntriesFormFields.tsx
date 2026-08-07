// @ts-nocheck

import { Classes, Position } from '@blueprintjs/core';
import classNames from 'classnames';
import { useFormikContext } from 'formik';
import React from 'react';
import intl from 'react-intl-universal';
import { ProjectBillableTypeSuggestField } from '../../components';
import { billableTypeOption } from '../common';
import { ProjectRowDivider, BillableEntiresBox } from './components';
import { useProjectBillableEntriesFormContext } from './ProjectBillableEntriesFormProvider';
import {
  FFormGroup,
  FInputGroup,
  FDateInput,
  FieldRequiredHint,
} from '@/components';
import { CLASSES } from '@/constants/classes';
import {
  inputIntent,
  momentFormatter,
  tansformDateValue,
  handleDateChange,
} from '@/utils';

/**
 * Project billable entries form fields.
 * @returns
 */
export function ProjectBillableEntriesFormFields() {
  // Formik context.
  const { values } = useFormikContext();

  const { billableEntries } = useProjectBillableEntriesFormContext();

  return (
    <div className={Classes.DIALOG_BODY}>
      {/*------------ Filter by Date -----------*/}
      <FFormGroup
        name={'date'}
        label={intl.get('project_billable_entries.dialog.filter_by_date')}
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
        label={intl.get('project_billable_entries.dialog.filter_by_type')}
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
