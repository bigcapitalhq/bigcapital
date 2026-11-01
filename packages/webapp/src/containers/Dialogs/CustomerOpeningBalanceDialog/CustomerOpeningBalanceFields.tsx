import { Classes, Position, ControlGroup } from '@blueprintjs/core';
import classNames from 'classnames';
import { FastField, useFormikContext } from 'formik';
import { isEqual } from 'lodash';
import intl from 'react-intl-universal';
import { useCustomerOpeningBalanceContext } from './CustomerOpeningBalanceFormProvider';
import { useSetPrimaryBranchToForm } from './utils';
import type { CustomerOpeningBalanceFormValues } from './utils';
import {
  If,
  Icon,
  ExchangeRateMutedField,
  BranchSelect,
  FeatureCan,
  InputPrependText,
} from '@/components';
import { FMoneyInputGroup, FFormGroup, FDateInput } from '@/components/Forms';
import { Features } from '@/constants';
import { useDateInputFormatter } from '@/hooks';
import { useCurrentOrganizationBaseCurrency } from '@/hooks/query';
import { tansformDateValue, handleDateChange } from '@/utils';

/**
 * Customer Opening balance fields.
 */
function CustomerOpeningBalanceFieldsInner() {
  const baseCurrency = useCurrentOrganizationBaseCurrency();

  // Formik context.
  const { values } = useFormikContext<CustomerOpeningBalanceFormValues>();

  const { branches, customer } = useCustomerOpeningBalanceContext();

  // Sets the primary branch to form.
  useSetPrimaryBranchToForm();
  const dateInputFormatter = useDateInputFormatter();

  return (
    <div className={Classes.DIALOG_BODY}>
      {/*------------ Opening balance -----------*/}
      <FFormGroup
        name={'openingBalance'}
        label={intl.get('customer_opening_balance.label.opening_balance')}
      >
        <ControlGroup>
          <InputPrependText text={customer.currencyCode} />
          <FMoneyInputGroup
            name={'openingBalance'}
            allowDecimals={true}
            allowNegativeValue={true}
          />
        </ControlGroup>
      </FFormGroup>

      {/*------------ Opening balance at -----------*/}
      <FFormGroup
        name={'openingBalanceAt'}
        label={intl.get('customer_opening_balance.label.opening_balance_at')}
        fastField
      >
        <FDateInput
          name={'openingBalanceAt'}
          {...dateInputFormatter}
          popoverProps={{ position: Position.BOTTOM, minimal: true }}
          inputProps={{
            leftIcon: <Icon icon={'date-range'} />,
          }}
          fill
          fastField
        />
      </FFormGroup>

      <If condition={!isEqual(baseCurrency, customer.currencyCode)}>
        {/*------------ Opening balance exchange rate -----------*/}
        <ExchangeRateMutedField
          name={'openingBalanceExchangeRate'}
          fromCurrency={baseCurrency}
          toCurrency={customer.currencyCode}
          formGroupProps={{ label: '', inline: false }}
          date={values.openingBalanceAt}
          exchangeRate={values.openingBalanceExchangeRate}
        />
      </If>

      {/*------------ Opening balance branch id -----------*/}
      <FeatureCan feature={Features.Branches}>
        <FFormGroup
          label={intl.get('branch')}
          name={'openingBalanceBranchId'}
          fastField
        >
          <BranchSelect
            name={'openingBalanceBranchId'}
            branches={branches}
            popoverProps={{ minimal: true }}
            fastField
            fill
          />
        </FFormGroup>
      </FeatureCan>
    </div>
  );
}
export const CustomerOpeningBalanceFields = CustomerOpeningBalanceFieldsInner;
