import { ControlGroup } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import React from 'react';
import intl from 'react-intl-universal';
import { useItemFormContext } from './ItemFormProvider';
import { ItemFormSectionTitle } from './ItemFormSectionTitle';
import {
  sellDescriptionFieldShouldUpdate,
  sellAccountFieldShouldUpdate,
  sellPriceFieldShouldUpdate,
} from './utils';
import type { ItemFormValues } from './types';
import {
  AccountsSelect,
  FCheckbox,
  FMoneyInputGroup,
  Hint,
  InputPrependText,
  FFormGroup,
  FTextArea,
  Box,
} from '@/components';
import { FormattedMessage as T } from '@/components';
import { TaxRatesSelect } from '@/components/TaxRates/TaxRatesSelect';
import { ACCOUNT_PARENT_TYPE } from '@/constants/accountTypes';
import { useCurrentOrganizationBaseCurrency } from '@/hooks/query';

export function ItemFormSellingSection() {
  const { accounts, taxRates } = useItemFormContext();
  const baseCurrency = useCurrentOrganizationBaseCurrency();
  const { values } = useFormikContext<ItemFormValues>();

  return (
    <Box data-section-id="selling">
      <ItemFormSectionTitle>Selling details</ItemFormSectionTitle>

      {/*------------- Sellable checkbox ------------- */}
      <FFormGroup
        name={'sellable'}
        inline={true}
        className={'form-group--sellable'}
        fastField
      >
        <FCheckbox
          name={'sellable'}
          inline={true}
          labelElement={<T id={'i_sell_this_item'} />}
          fastField
        />
      </FFormGroup>

      {/*------------- Selling price ------------- */}
      <FFormGroup
        name={'sell_price'}
        label={<T id={'selling_price'} />}
        inline={true}
        fastField
      >
        <ControlGroup fill>
          <InputPrependText text={baseCurrency} />
          <FMoneyInputGroup
            name={'sell_price'}
            shouldUpdate={sellPriceFieldShouldUpdate}
            sellable={values.sellable}
            inputGroupProps={{ fill: true }}
            disabled={!values.sellable}
            fastField
          />
        </ControlGroup>
      </FFormGroup>

      {/*------------- Selling account ------------- */}
      <FFormGroup
        label={<T id={'account'} />}
        name={'sell_account_id'}
        labelInfo={<Hint content={intl.get('item.field.sell_account.hint')} />}
        inline={true}
      >
        <AccountsSelect
          name={'sell_account_id'}
          items={accounts}
          placeholder={intl.get('select_account')}
          disabled={!values.sellable}
          filterByParentTypes={[ACCOUNT_PARENT_TYPE.INCOME]}
          fill={true}
          allowCreate={true}
          fastField={true}
          sellable={values.sellable}
          shouldUpdate={sellAccountFieldShouldUpdate}
        />
      </FFormGroup>

      {/*------------- Sell Tax Rate ------------- */}
      <FFormGroup name={'sell_tax_rate_id'} label={'Tax Rate'} inline={true}>
        <TaxRatesSelect
          name={'sell_tax_rate_id'}
          items={taxRates}
          allowCreate
        />
      </FFormGroup>

      <FFormGroup
        name={'sell_description'}
        label={<T id={'description'} />}
        inline={true}
        fastField
      >
        <FTextArea
          name={'sell_description'}
          growVertically={true}
          disabled={!values.sellable}
          fill
          fastField
          shouldUpdate={sellDescriptionFieldShouldUpdate}
        />
      </FFormGroup>
    </Box>
  );
}
