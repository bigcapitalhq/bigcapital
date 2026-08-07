import { Position, Classes } from '@blueprintjs/core';
import { css } from '@emotion/css';
import { Theme, useTheme } from '@emotion/react';
import classNames from 'classnames';
import { useFormikContext } from 'formik';
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import {
  ReceiptExchangeRateInputField,
  ReceiptProjectSelectButton,
} from './components';
import { useReceiptFormContext } from './ReceiptFormProvider';
import { ReceiptFormReceiptNumberField } from './ReceiptFormReceiptNumberField';
import { accountsFieldShouldUpdate, customersFieldShouldUpdate } from './utils';
import type { ReceiptFormValues } from './utils';
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
import { Features } from '@/constants';
import { ACCOUNT_TYPE } from '@/constants/accountTypes';
import { useCustomerUpdateExRate } from '@/containers/Entries/withExRateItemEntriesPriceRecalc';
import { ProjectsSelect } from '@/containers/Projects/components';

const getEstimateFieldsStyle = (theme: Theme & { bpPrefix?: string }) => css`
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
export function ReceiptFormHeader() {
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
        label={intl.get('deposit_account')}
        inline={true}
        labelInfo={<FieldRequiredHint />}
        name={'depositAccountId'}
      >
        <AccountsSelect
          items={accounts}
          name={'depositAccountId'}
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
        name={'receiptDate'}
        label={intl.get('receipt_date')}
        inline
        fastField
      >
        <FDateInput
          name={'receiptDate'}
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
        label={intl.get('reference')}
        inline={true}
        name={'referenceNo'}
      >
        <FInputGroup name={'referenceNo'} />
      </FFormGroup>

      {/*------------ Project name -----------*/}
      <FeatureCan feature={Features.Projects}>
        <FFormGroup
          name={'projectId'}
          label={intl.get('receipt.project_name.label')}
          inline={true}
          className={classNames('form-group--select-list', Classes.FILL)}
        >
          <ProjectsSelect
            name={'projectId'}
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
  const { setFieldValue, values } = useFormikContext<ReceiptFormValues>();
  const { customers } = useReceiptFormContext();

  const updateEntries = useCustomerUpdateExRate();

  // Handles the customer item change.
  const handleItemChange = (customer: {
    id: number;
    currency_code: string;
  }) => {
    setFieldValue('customerId', customer.id);
    setFieldValue('currencyCode', customer?.currency_code);

    updateEntries(customer);
  };

  return (
    <FFormGroup
      name={'customerId'}
      label={intl.get('customer_name')}
      labelInfo={<FieldRequiredHint />}
      inline={true}
    >
      <>
        <CustomersSelect
          name={'customerId'}
          items={customers}
          placeholder={<T id={'select_customer_account'} />}
          onItemChange={handleItemChange}
          popoverFill={true}
          allowCreate={true}
          fastField={true}
          shouldUpdate={customersFieldShouldUpdate}
          shouldUpdateDeps={{ items: customers }}
        />
        {values.customerId && (
          <CustomerButtonLink customerId={values.customerId}>
            <T id={'view_customer_details'} />
          </CustomerButtonLink>
        )}
      </>
    </FFormGroup>
  );
}

const CustomerButtonLink = styled(CustomerDrawerLink)`
  font-size: 11px;
  margin-top: 6px;
`;
