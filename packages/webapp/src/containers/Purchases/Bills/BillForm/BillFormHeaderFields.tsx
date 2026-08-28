import { Classes, Position } from '@blueprintjs/core';
import { css } from '@emotion/css';
import { useTheme } from '@emotion/react';
import { Theme } from '@xstyled/emotion';
import classNames from 'classnames';
import { useFormikContext } from 'formik';
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { useBillFormContext } from './BillFormProvider';
import {
  BillExchangeRateInputField,
  BillProjectSelectButton,
} from './components';
import { vendorsFieldShouldUpdate, type BillFormValues } from './utils';
import { FeatureCan, Stack, FormattedMessage as T } from '@/components';
import {
  FFormGroup,
  FieldRequiredHint,
  Icon,
  VendorDrawerLink,
  VendorsSelect,
  FDateInput,
  FInputGroup,
} from '@/components';
import { Features } from '@/constants';
import { CLASSES } from '@/constants/classes';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { ProjectsSelect } from '@/containers/Projects/components';
import { useDateInputFormatter } from '@/hooks';
import { compose } from '@/utils';

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
  const dateInputFormatter = useDateInputFormatter();

  return (
    <Stack spacing={18} flex={1} className={billFieldsClassName}>
      {/* ------- Vendor name ------ */}
      <BillFormVendorField />

      {/* ----------- Exchange rate ----------- */}
      <BillExchangeRateInputField
        formGroupProps={{ label: ' ', inline: true }}
      />

      {/* ------- Bill date ------- */}
      <FFormGroup
        name={'billDate'}
        label={intl.get('bill_date')}
        inline
        labelInfo={<FieldRequiredHint />}
        className={classNames(CLASSES.FILL)}
        fastField
      >
        <FDateInput
          name={'billDate'}
          {...dateInputFormatter}
          popoverProps={{ position: Position.BOTTOM, minimal: true }}
          inputProps={{ leftIcon: <Icon icon={'date-range'} /> }}
          fill
          fastField
        />
      </FFormGroup>

      {/* ------- Due date ------- */}
      <FFormGroup
        name={'dueDate'}
        label={intl.get('due_date')}
        inline
        fastField
      >
        <FDateInput
          name={'dueDate'}
          {...dateInputFormatter}
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
        name={'billNumber'}
        label={intl.get('bill_number')}
        inline
        fastField
      >
        <FInputGroup name={'billNumber'} />
      </FFormGroup>

      {/* ------- Reference ------- */}
      <FFormGroup
        name={'referenceNo'}
        label={intl.get('reference')}
        inline={true}
        fastField
      >
        <FInputGroup name={'referenceNo'} />
      </FFormGroup>

      {/*------------ Project name -----------*/}
      <FeatureCan feature={Features.Projects}>
        <FFormGroup
          name={'projectId'}
          label={intl.get('bill.project_name.label')}
          inline={true}
          className={classNames('form-group--select-list', Classes.FILL)}
        >
          <ProjectsSelect
            name={'projectId'}
            projects={projects}
            input={BillProjectSelectButton}
            popoverFill={true}
          />
        </FFormGroup>
      </FeatureCan>
    </Stack>
  );
}

type VendorOption = { id: number; currencyCode?: string };

/**
 * Vendor select field of bill form.
 * @returns {JSX.Element}
 */
function BillFormVendorField() {
  const { values, setFieldValue } = useFormikContext<BillFormValues>();
  const { vendors } = useBillFormContext();

  return (
    <FFormGroup
      name={'vendorId'}
      label={intl.get('vendor_name')}
      inline={true}
      labelInfo={<FieldRequiredHint />}
      fastField={true}
    >
      <>
        <VendorsSelect
          name={'vendorId'}
          items={vendors}
          placeholder={<T id={'select_vender_account'} />}
          onItemChange={(contact: VendorOption) => {
            setFieldValue('vendorId', contact.id);
            setFieldValue('currencyCode', contact?.currencyCode);
          }}
          allowCreate={true}
          fastField={true}
          shouldUpdate={vendorsFieldShouldUpdate}
          shouldUpdateDeps={{ items: vendors }}
        />
        {values.vendorId && (
          <VendorButtonLink vendorId={Number(values.vendorId)}>
            <T id={'view_vendor_details'} />
          </VendorButtonLink>
        )}
      </>
    </FFormGroup>
  );
}

export const BillFormHeaderFields = compose(withDialogActions)(BillFormHeader);

const VendorButtonLink = styled(VendorDrawerLink)`
  font-size: 11px;
  margin-top: 6px;
`;
