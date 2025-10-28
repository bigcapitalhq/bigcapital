// @ts-nocheck
import React from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import { useFormikContext } from 'formik';
import { Position, Classes } from '@blueprintjs/core';
import { css } from '@emotion/css';
import { Theme, useTheme } from '@emotion/react';

import { ACCOUNT_TYPE } from '@/constants/accountTypes';
import { Features } from '@/constants';
import {
  FFormGroup,
  AccountsSelect,
  CustomersSelect,
  FieldRequiredHint,
  Icon,
  CustomerDrawerLink,
  FormattedMessage as T,
  FeatureCan,
  FInputGroup,
  Stack,
  FDateInput,
} from '@/components';
import { ProjectsSelect } from '@/containers/Projects/components';
import { useReceiptFormContext } from './ReceiptFormProvider';
import { accountsFieldShouldUpdate, customersFieldShouldUpdate } from './utils';
import {
  ReceiptExchangeRateInputField,
  ReceiptProjectSelectButton,
} from './components';
import { ReceiptFormReceiptNumberField } from './ReceiptFormReceiptNumberField';
import { useCustomerUpdateExRate } from '@/containers/Entries/withExRateItemEntriesPriceRecalc';

const getEstimateFieldsStyle = (theme: Theme) => css`
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
 * Receipt form header fields.
 */
export default function ReceiptFormHeader() {
  const theme = useTheme();
  const receiptFieldsClassName = getEstimateFieldsStyle(theme);
  const { accounts, projects } = useReceiptFormContext();

  return (
    <Stack spacing={18} flex={1} className={receiptFieldsClassName}>
      {/* ----------- Customer name ----------- */}
      <ReceiptFormCustomerSelect />

      {/* ----------- Exchange rate ----------- */}
      <ReceiptExchangeRateInputField />

      {/* ----------- Deposit account ----------- */}
      <FFormGroup
        label={<T id={'deposit_account'} />}
        inline={true}
        labelInfo={<FieldRequiredHint />}
        name={'deposit_account_id'}
        items={accounts}
        fastField={true}
        shouldUpdate={accountsFieldShouldUpdate}
      >
        <AccountsSelect
          items={accounts}
          name={'deposit_account_id'}
          placeholder={<T id={'select_deposit_account'} />}
          filterByTypes={[
            ACCOUNT_TYPE.CASH,
            ACCOUNT_TYPE.BANK,
            ACCOUNT_TYPE.OTHER_CURRENT_ASSET,
          ]}
          allowCreate={true}
          fill={true}
          fastField={true}
          shouldUpdate={accountsFieldShouldUpdate}
        />
      </FFormGroup>

      {/* ----------- Receipt date ----------- */}
      <FFormGroup
        name={'receipt_date'}
        label={<T id={'receipt_date'} />}
        inline
        fastField
      >
        <FDateInput
          name={'receipt_date'}
          formatDate={(date) => date.toLocaleDateString()}
          parseDate={(str) => new Date(str)}
          popoverProps={{ position: Position.BOTTOM_LEFT, minimal: true }}
          inputProps={{
            leftIcon: <Icon icon={'date-range'} />,
            fill: true,
          }}
          fill
          fastField
        />
      </FFormGroup>

      {/* ----------- Receipt number ----------- */}
      <ReceiptFormReceiptNumberField />

      {/* ----------- Reference ----------- */}
      <FFormGroup
        label={<T id={'reference'} />}
        inline={true}
        name={'reference_no'}
      >
        <FInputGroup minimal={true} name={'reference_no'} />
      </FFormGroup>

      {/*------------ Project name -----------*/}
      <FeatureCan feature={Features.Projects}>
        <FFormGroup
          name={'project_id'}
          label={<T id={'receipt.project_name.label'} />}
          inline={true}
          className={classNames('form-group--select-list', Classes.FILL)}
        >
          <ProjectsSelect
            name={'project_id'}
            projects={projects}
            input={ReceiptProjectSelectButton}
            popoverFill={true}
          />
        </FFormGroup>
      </FeatureCan>
    </Stack>
  );
}

/**
 * Customer select field of receipt form.
 * @returns {React.ReactNode}
 */
function ReceiptFormCustomerSelect() {
  const { setFieldValue, values } = useFormikContext();
  const { customers } = useReceiptFormContext();

  const updateEntries = useCustomerUpdateExRate();

  // Handles the customer item change.
  const handleItemChange = (customer) => {
    setFieldValue('customer_id', customer.id);
    setFieldValue('currency_code', customer?.currency_code);

    updateEntries(customer);
  };

  return (
    <FFormGroup
      name={'customer_id'}
      label={<T id={'customer_name'} />}
      labelInfo={<FieldRequiredHint />}
      inline={true}
      fastField={true}
      shouldUpdate={customersFieldShouldUpdate}
      shouldUpdateDeps={{ items: customers }}
    >
      <CustomersSelect
        name={'customer_id'}
        items={customers}
        placeholder={<T id={'select_customer_account'} />}
        onItemChange={handleItemChange}
        popoverFill={true}
        allowCreate={true}
        fastField={true}
        shouldUpdate={customersFieldShouldUpdate}
        shouldUpdateDeps={{ items: customers }}
      />
      {values.customer_id && (
        <CustomerButtonLink customerId={values.customer_id}>
          <T id={'view_customer_details'} />
        </CustomerButtonLink>
      )}
    </FFormGroup>
  );
}

const CustomerButtonLink = styled(CustomerDrawerLink)`
  font-size: 11px;
  margin-top: 6px;
`;
