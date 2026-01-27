// @ts-nocheck
import React from 'react';
import { Classes, Position, FormGroup, ControlGroup } from '@blueprintjs/core';
import { DateInput } from '@blueprintjs/datetime';
import { isEqual } from 'lodash';
import { FastField, useFormikContext } from 'formik';
import { momentFormatter, tansformDateValue, handleDateChange } from '@/utils';
import { Features } from '@/constants';
import classNames from 'classnames';

import {
  If,
  Icon,
  FormattedMessage as T,
  ExchangeRateMutedField,
  BranchSelect,
  FeatureCan,
  InputPrependText,
} from '@/components';
import { FMoneyInputGroup, FFormGroup, FDateInput } from '@/components/Forms';

import { useVendorOpeningBalanceContext } from './VendorOpeningBalanceFormProvider';
import { useSetPrimaryBranchToForm } from './utils';

import { withCurrentOrganization } from '@/containers/Organization/withCurrentOrganization';
import { compose } from '@/utils';

/**
 * Vendor Opening balance form fields.
 * @returns
 */
function VendorOpeningBalanceFormFields({
  // #withCurrentOrganization
  organization: { base_currency },
}) {
  // Formik context.
  const { values } = useFormikContext();

  const { branches, vendor } = useVendorOpeningBalanceContext();

  // Sets the primary branch to form.
  useSetPrimaryBranchToForm();

  return (
    <div className={Classes.DIALOG_BODY}>
      {/*------------ Opening balance -----------*/}
      <FFormGroup
        name={'opening_balance'}
        label={<T id={'vendor_opening_balance.label.opening_balance'} />}
      >
        <ControlGroup>
          <InputPrependText text={vendor.currency_code} />
          <FMoneyInputGroup
            name={'opening_balance'}
            allowDecimals={true}
            allowNegativeValue={true}
          />
        </ControlGroup>
      </FFormGroup>

      {/*------------ Opening balance at -----------*/}
      <FFormGroup
        name={'opening_balance_at'}
        label={<T id={'vendor_opening_balance.label.opening_balance_at'} />}
        fill
        fastField
      >
        <FDateInput
          name={'opening_balance_at'}
          formatDate={(date) => date.toLocaleDateString()}
          parseDate={(str) => new Date(str)}
          popoverProps={{ position: Position.BOTTOM, minimal: true }}
          inputProps={{
            leftIcon: <Icon icon={'date-range'} />,
          }}
          fill
          fastField
        />
      </FFormGroup>

      <If condition={!isEqual(base_currency, vendor.currency_code)}>
        {/*------------ Opening balance exchange rate -----------*/}
        <ExchangeRateMutedField
          name={'opening_balance_exchange_rate'}
          fromCurrency={base_currency}
          toCurrency={vendor.currency_code}
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
          fill
          fastField
        >
          <BranchSelect
            name={'opening_balance_branch_id'}
            branches={branches}
            popoverProps={{ minimal: true }}
          />
        </FFormGroup>
      </FeatureCan>
    </div>
  );
}

export default compose(withCurrentOrganization())(
  VendorOpeningBalanceFormFields,
);
