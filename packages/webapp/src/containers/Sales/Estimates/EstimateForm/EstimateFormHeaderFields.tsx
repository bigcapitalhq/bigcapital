import { Position, Classes } from '@blueprintjs/core';
import { css } from '@emotion/css';
import { useTheme } from '@emotion/react';
import { Theme } from '@xstyled/emotion';
import classNames from 'classnames';
import { useFormikContext } from 'formik';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import {
  EstimateExchangeRateInputField,
  EstimateProjectSelectButton,
} from './components';
import { EstimateFormEstimateNumberField } from './EstimateFormEstimateNumberField';
import { useEstimateFormContext } from './EstimateFormProvider';
import { customersFieldShouldUpdate } from './utils';
import type { EstimateFormValues } from './utils';
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
import { Features } from '@/constants';
import { useCustomerUpdateExRate } from '@/containers/Entries/withExRateItemEntriesPriceRecalc';
import { ProjectsSelect } from '@/containers/Projects/components';

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

type Customer = { id: number; currency_code: string };

/**
 * Estimate form header.
 */
export function EstimateFormHeader() {
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
        name={'estimateDate'}
        label={intl.get('estimate_date')}
        labelInfo={<FieldRequiredHint />}
        inline
        fastField
      >
        <FDateInput
          name={'estimateDate'}
          formatDate={(date: Date) => date.toLocaleDateString()}
          parseDate={(str: string) => new Date(str)}
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
        name={'expirationDate'}
        label={intl.get('expiration_date')}
        inline
        fastField
      >
        <FDateInput
          name={'expirationDate'}
          formatDate={(date: Date) => date.toLocaleDateString()}
          parseDate={(str: string) => new Date(str)}
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
      <FFormGroup name={'reference'} label={intl.get('reference')} inline>
        <FInputGroup name={'reference'} />
      </FFormGroup>

      {/*------------ Project name -----------*/}
      <FeatureCan feature={Features.Projects}>
        <FFormGroup
          name={'projectId'}
          label={intl.get('estimate.project_name.label')}
          inline={true}
          className={classNames('form-group--select-list', Classes.FILL)}
        >
          <ProjectsSelect
            name={'projectId'}
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
  const { setFieldValue, values } = useFormikContext<EstimateFormValues>();
  const { customers } = useEstimateFormContext();

  const updateEntries = useCustomerUpdateExRate();

  // Handles the customer item change.
  const handleItemChange = (customer: Customer) => {
    setFieldValue('customerId', customer.id);
    setFieldValue('currencyCode', customer?.currency_code);

    updateEntries(customer);
  };

  return (
    <FFormGroup
      name={'customerId'}
      label={intl.get('customer_name')}
      inline={true}
      labelInfo={<FieldRequiredHint />}
      fastField={true}
    >
      <>
        <CustomersSelect
          name={'customerId'}
          items={customers}
          placeholder={<T id={'select_customer_account'} />}
          onItemChange={handleItemChange}
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
