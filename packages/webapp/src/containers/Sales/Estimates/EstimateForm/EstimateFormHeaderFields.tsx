// @ts-nocheck
import styled from 'styled-components';
import classNames from 'classnames';
import { Position, Classes } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import { css } from '@emotion/css';
import {
  FeatureCan,
  FFormGroup,
  FormattedMessage as T,
  FieldRequiredHint,
  Icon,
  CustomerDrawerLink,
  CustomersSelect,
  FInputGroup,
  Stack,
  FDateInput,
} from '@/components';
import { customersFieldShouldUpdate } from './utils';
import { Features } from '@/constants';
import { ProjectsSelect } from '@/containers/Projects/components';
import {
  EstimateExchangeRateInputField,
  EstimateProjectSelectButton,
} from './components';
import { EstimateFormEstimateNumberField } from './EstimateFormEstimateNumberField';
import { useEstimateFormContext } from './EstimateFormProvider';
import { useCustomerUpdateExRate } from '@/containers/Entries/withExRateItemEntriesPriceRecalc';
import { useTheme } from '@emotion/react';
import { Theme } from '@xstyled/emotion';

const getEstimateFieldsStyle = (theme: Theme) => css`
  .${theme.bpPrefix}-form-group {
    margin-bottom: 0;

    &.${theme.bpPrefix}-inline {
      max-width: 470px;
    }
    .${theme.bpPrefix}-label {
      min-width: 160px;
      font-weight: 500;
    }
    .${theme.bpPrefix}-form-content {
      width: 100%;
    }
  }
`;

/**
 * Estimate form header.
 */
export default function EstimateFormHeader() {
  const theme = useTheme();
  const { projects } = useEstimateFormContext();
  const styleClassName = getEstimateFieldsStyle(theme);

  return (
    <Stack spacing={18} flex={1} className={styleClassName}>
      {/* ----------- Customer name ----------- */}
      <EstimateFormCustomerSelect />

      {/* ----------- Exchange Rate ----------- */}
      <EstimateExchangeRateInputField />

      {/* ----------- Estimate Date ----------- */}
      <FFormGroup
        name={'estimate_date'}
        label={<T id={'estimate_date'} />}
        labelInfo={<FieldRequiredHint />}
        inline
        fastField
      >
        <FDateInput
          name={'estimate_date'}
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

      {/* ----------- Expiration date ----------- */}
      <FFormGroup
        name={'expiration_date'}
        label={<T id={'expiration_date'} />}
        inline
        fastField
      >
        <FDateInput
          name={'expiration_date'}
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

      {/* ----------- Estimate number ----------- */}
      <EstimateFormEstimateNumberField />

      {/* ----------- Reference ----------- */}
      <FFormGroup name={'reference'} label={<T id={'reference'} />} inline fill>
        <FInputGroup name={'reference'} minimal={true} />
      </FFormGroup>

      {/*------------ Project name -----------*/}
      <FeatureCan feature={Features.Projects}>
        <FFormGroup
          name={'project_id'}
          label={<T id={'estimate.project_name.label'} />}
          inline={true}
          className={classNames('form-group--select-list', Classes.FILL)}
        >
          <ProjectsSelect
            name={'project_id'}
            projects={projects}
            input={EstimateProjectSelectButton}
            popoverFill={true}
          />
        </FFormGroup>
      </FeatureCan>
    </Stack>
  );
}

/**
 * Customer select field of estimate form.
 * @returns {React.ReactNode}
 */
function EstimateFormCustomerSelect() {
  const { setFieldValue, values } = useFormikContext();
  const { customers } = useEstimateFormContext();

  const updateEntries = useCustomerUpdateExRate();

  // Handles the customer item change.
  const handleItemChange = (customer) => {
    setFieldValue('customer_id', customer.id);
    setFieldValue('currency_code', customer?.currency_code);

    updateEntries(customer);
  };

  return (
    <FFormGroup
      label={<T id={'customer_name'} />}
      inline={true}
      labelInfo={<FieldRequiredHint />}
      name={'customer_id'}
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
