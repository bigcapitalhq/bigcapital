// @ts-nocheck
import React from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import { useFormikContext } from 'formik';
import { Classes, Position } from '@blueprintjs/core';
import { css } from '@emotion/css';

import { FeatureCan, Stack, FormattedMessage as T } from '@/components';
import { CLASSES } from '@/constants/classes';
import {
  FFormGroup,
  FieldRequiredHint,
  Icon,
  VendorDrawerLink,
  VendorsSelect,
  FDateInput,
  FInputGroup,
} from '@/components';

import { useBillFormContext } from './BillFormProvider';
import { vendorsFieldShouldUpdate } from './utils';
import {
  BillExchangeRateInputField,
  BillProjectSelectButton,
} from './components';
import { ProjectsSelect } from '@/containers/Projects/components';
import withDialogActions from '@/containers/Dialog/withDialogActions';
import {
  momentFormatter,
  compose,
} from '@/utils';
import { Features } from '@/constants';
import { useTheme } from '@emotion/react';

const getBillFieldsStyle = (theme: Theme) => css`
  .${theme.bpPrefix}-form-group {
    margin-bottom: 0;

    &.${theme.bpPrefix}-inline {
      max-width: 450px;
    }
    .${theme.bpPrefix}-label {
      min-width: 150px;
      font-weight: 500;
    }
    .${theme.bpPrefix}-form-content {
      width: 100%;
    }
  }
`;

/**
 * Fill form header.
 */
function BillFormHeader() {
  // Bill form context.
  const { vendors, projects } = useBillFormContext();

  const theme = useTheme();
  const billFieldsClassName = getBillFieldsStyle(theme);

  return (
    <Stack spacing={18} flex={1} className={billFieldsClassName}>
      {/* ------- Vendor name ------ */}
      <BillFormVendorField />

      {/* ----------- Exchange rate ----------- */}
      <BillExchangeRateInputField
        name={'exchange_rate'}
        formGroupProps={{ label: ' ', inline: true }}
      />

      {/* ------- Bill date ------- */}
      <FFormGroup
        name={'bill_date'}
        label={<T id={'bill_date'} />}
        inline
        labelInfo={<FieldRequiredHint />}
        className={classNames(CLASSES.FILL)}
        fastField
      >
        <FDateInput
          name={'bill_date'}
          {...momentFormatter('YYYY/MM/DD')}
          popoverProps={{ position: Position.BOTTOM, minimal: true }}
          inputProps={{ leftIcon: <Icon icon={'date-range'} /> }}
          fill
          fastField
        />
      </FFormGroup>

      {/* ------- Due date ------- */}
      <FFormGroup
        name={'due_date'}
        label={<T id={'due_date'} />}
        inline
        fill
        fastField
      >
        <FDateInput
          name={'due_date'}
          {...momentFormatter('YYYY/MM/DD')}
          popoverProps={{ position: Position.BOTTOM, minimal: true }}
          inputProps={{
            leftIcon: <Icon icon={'date-range'} />,
          }}
          fill
          fastField
        />
      </FFormGroup>

      {/* ------- Bill number ------- */}
      <FFormGroup
        name={'bill_number'}
        label={<T id={'bill_number'} />}
        inline
        fill
        fastField
      >
        <FInputGroup name={'bill_number'} minimal={true} fastField />
      </FFormGroup>

      {/* ------- Reference ------- */}
      <FFormGroup
        name={'reference_no'}
        label={<T id={'reference'} />}
        inline={true}
        fill
        fastField
      >
        <FInputGroup name={'reference_no'} minimal={true} fastField />
      </FFormGroup>

      {/*------------ Project name -----------*/}
      <FeatureCan feature={Features.Projects}>
        <FFormGroup
          name={'project_id'}
          label={<T id={'bill.project_name.label'} />}
          inline={true}
          className={classNames('form-group--select-list', Classes.FILL)}
        >
          <ProjectsSelect
            name={'project_id'}
            projects={projects}
            input={BillProjectSelectButton}
            popoverFill={true}
          />
        </FFormGroup>
      </FeatureCan>
    </Stack>
  );
}

/**
 * Vendor select field of bill form.
 * @returns {JSX.Element}
 */
function BillFormVendorField() {
  const { values, setFieldValue } = useFormikContext();
  const { vendors } = useBillFormContext();

  return (
    <FFormGroup
      name={'vendor_id'}
      label={<T id={'vendor_name'} />}
      inline={true}
      labelInfo={<FieldRequiredHint />}
      fastField={true}
      shouldUpdate={vendorsFieldShouldUpdate}
      shouldUpdateDeps={{ items: vendors }}
    >
      <VendorsSelect
        name={'vendor_id'}
        items={vendors}
        placeholder={<T id={'select_vender_account'} />}
        onItemChange={(contact) => {
          setFieldValue('vendor_id', contact.id);
          setFieldValue('currency_code', contact?.currency_code);
        }}
        allowCreate={true}
        fastField={true}
        shouldUpdate={vendorsFieldShouldUpdate}
        shouldUpdateDeps={{ items: vendors }}
      />
      {values.vendor_id && (
        <VendorButtonLink vendorId={values.vendor_id}>
          <T id={'view_vendor_details'} />
        </VendorButtonLink>
      )}
    </FFormGroup>
  );
}

export default compose(withDialogActions)(BillFormHeader);

const VendorButtonLink = styled(VendorDrawerLink)`
  font-size: 11px;
  margin-top: 6px;
`;
