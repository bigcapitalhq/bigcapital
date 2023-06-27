// @ts-nocheck
import React from 'react';
import { Classes, Position, FormGroup, ControlGroup } from '@blueprintjs/core';
import { DateInput } from '@blueprintjs/datetime';
import { isEqual } from 'lodash';
import { FastField, useFormikContext } from 'formik';
import { momentFormatter, transformDateValue, handleDateChange } from '@/utils';
import { Features } from '@/constants';
import classNames from 'classnames';

import {
  If,
  Icon,
  FormattedMessage as T,
  ExchangeRateMutedField,
  BranchSelect,
  BranchSelectButton,
  FeatureCan,
  InputPrependText,
} from '@/components';
import { FMoneyInputGroup, FFormGroup } from '@/components/Forms';

import { useCustomerOpeningBalanceContext } from './CustomerOpeningBalanceFormProvider';
import { useSetPrimaryBranchToForm } from './utils';

import withCurrentOrganization from '@/containers/Organization/withCurrentOrganization';
import { compose } from '@/utils';

/**
 * Customer Opening balance fields.
 * @returns
 */
function CustomerOpeningBalanceFields({
  // #withCurrentOrganization
  organization: { base_currency },
}) {
  // Formik context.
  const { values } = useFormikContext();

  const { branches, customer } = useCustomerOpeningBalanceContext();

  // Sets the primary branch to form.
  useSetPrimaryBranchToForm();

  return (
    <div className={Classes.DIALOG_BODY}>
      {/*------------ Opening balance -----------*/}
      <FFormGroup
        name={'opening_balance'}
        label={<T id={'customer_opening_balance.label.opening_balance'} />}
      >
        <ControlGroup>
          <InputPrependText text={customer.currency_code} />
          <FMoneyInputGroup
            name={'opening_balance'}
            allowDecimals={true}
            allowNegativeValue={true}
          />
        </ControlGroup>
      </FFormGroup>

      {/*------------ Opening balance at -----------*/}
      <FastField name={'opening_balance_at'}>
        {({ form, field: { value } }) => (
          <FormGroup
            label={
              <T id={'customer_opening_balance.label.opening_balance_at'} />
            }
            className={Classes.FILL}
          >
            <DateInput
              {...momentFormatter('YYYY/MM/DD')}
              onChange={handleDateChange((formattedDate) => {
                form.setFieldValue('opening_balance_at', formattedDate);
              })}
              value={transformDateValue(value)}
              popoverProps={{ position: Position.BOTTOM, minimal: true }}
              inputProps={{
                leftIcon: <Icon icon={'date-range'} />,
              }}
            />
          </FormGroup>
        )}
      </FastField>

      <If condition={!isEqual(base_currency, customer.currency_code)}>
        {/*------------ Opening balance exchange rate -----------*/}
        <ExchangeRateMutedField
          name={'opening_balance_exchange_rate'}
          fromCurrency={base_currency}
          toCurrency={customer.currency_code}
          formGroupProps={{ label: '', inline: false }}
          date={values.opening_balance_at}
          exchangeRate={values.opening_balance_exchange_rate}
        />
      </If>

      {/*------------ Opening balance branch id -----------*/}
      <FeatureCan feature={Features.Branches}>
        <FFormGroup
          label={<T id={'branch'} />}
          name={'opening_balance_branch_id'}
          className={classNames('form-group--select-list', Classes.FILL)}
        >
          <BranchSelect
            name={'opening_balance_branch_id'}
            branches={branches}
            input={BranchSelectButton}
            popoverProps={{ minimal: true }}
          />
        </FFormGroup>
      </FeatureCan>
    </div>
  );
}
export default compose(withCurrentOrganization())(CustomerOpeningBalanceFields);
