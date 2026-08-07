// @ts-nocheck
import { Classes, Position, FormGroup, ControlGroup } from '@blueprintjs/core';
import classNames from 'classnames';
import React from 'react';
import intl from 'react-intl-universal';
import {
  FFormGroup,
  FCheckbox,
  FDateInput,
  FieldRequiredHint,
} from '@/components';
import { CLASSES } from '@/constants/classes';
import { momentFormatter } from '@/utils';

/**
 * Project invoicing form fields.
 * @returns
 */
export function ProjectInvoicingFormFields() {
  return (
    <div className={Classes.DIALOG_BODY}>
      {/*------------ Date -----------*/}
      <FFormGroup
        label={intl.get('project_invoicing.dialog.bill_to')}
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

      <FFormGroup name={'time'}>
        {/*------------ All time entreis -----------*/}
        <FCheckbox
          name="time"
          label={intl.get('project_invoicing.dialog.all_time_entries')}
        />
        {/*------------ All unbilled expenses -----------*/}
        <FCheckbox
          name="unbilled"
          label={intl.get('project_invoicing.dialog.all_unbilled_expenses')}
        />
        {/*------------ All bills. -----------*/}
        <FCheckbox
          name="bills"
          label={intl.get('project_invoicing.dialog.all_bills')}
        />
      </FFormGroup>
    </div>
  );
}
