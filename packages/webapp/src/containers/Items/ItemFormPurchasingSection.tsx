import { ControlGroup } from '@blueprintjs/core';
import { useFormikContext, ErrorMessage } from 'formik';
import React from 'react';
import intl from 'react-intl-universal';
import { useItemFormContext } from './ItemFormProvider';
import { ItemFormSectionTitle } from './ItemFormSectionTitle';
import {
  costPriceFieldShouldUpdate,
  costAccountFieldShouldUpdate,
  purchaseDescFieldShouldUpdate,
  taxRateFieldShouldUpdate,
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

export function ItemFormPurchasingSection() {
  const { accounts, taxRates } = useItemFormContext();
  const { values } = useFormikContext<ItemFormValues>();
  const baseCurrency = useCurrentOrganizationBaseCurrency();

  return (
    <Box data-section-id="purchasing">
      <ItemFormSectionTitle>Purchasing details</ItemFormSectionTitle>

      {/*------------- Purchasable checkbox ------------- */}
      <FFormGroup
        name={'purchasable'}
        inline={true}
        className={'form-group--purchasable'}
        fastField
      >
        <FCheckbox
          name={'purchasable'}
          inline={true}
          labelElement={<T id={'i_purchase_this_item'} />}
          fastField
        />
      </FFormGroup>

      {/*------------- Cost price ------------- */}
      <FFormGroup
        name={'costPrice'}
        label={<T id={'cost_price'} />}
        inline={true}
        fastField
      >
        <ControlGroup fill>
          <InputPrependText text={baseCurrency} />
          <FMoneyInputGroup
            name={'costPrice'}
            shouldUpdate={costPriceFieldShouldUpdate}
            purchasable={values.purchasable}
            inputGroupProps={{ medium: true }}
            disabled={!values.purchasable}
            fastField
          />
        </ControlGroup>
      </FFormGroup>

      {/*------------- Cost account ------------- */}
      <FFormGroup
        name={'costAccountId'}
        label={<T id={'account'} />}
        labelInfo={<Hint content={intl.get('item.field.cost_account.hint')} />}
        inline={true}
      >
        <AccountsSelect
          name={'costAccountId'}
          items={accounts}
          placeholder={intl.get('select_account')}
          filterByParentTypes={[ACCOUNT_PARENT_TYPE.EXPENSE]}
          popoverFill={true}
          allowCreate={true}
          fastField={true}
          disabled={!values.purchasable}
          purchasable={values.purchasable}
          shouldUpdate={costAccountFieldShouldUpdate}
        />
      </FFormGroup>

      {/*------------- Purchase Tax Rate ------------- */}
      <FFormGroup name={'purchaseTaxRateId'} label={'Tax Rate'} inline={true}>
        <TaxRatesSelect
          name={'purchaseTaxRateId'}
          items={taxRates}
          allowCreate={true}
          fastField={true}
          shouldUpdateDeps={{ taxRates }}
          shouldUpdate={taxRateFieldShouldUpdate}
        />
      </FFormGroup>

      <FFormGroup
        name={'purchaseDescription'}
        label={<T id={'description'} />}
        className={'form-group--purchase-description'}
        helperText={<ErrorMessage name={'description'} />}
        inline={true}
      >
        <FTextArea
          name={'purchaseDescription'}
          growVertically={true}
          disabled={!values.purchasable}
          fill
          shouldUpdate={purchaseDescFieldShouldUpdate}
        />
      </FFormGroup>
    </Box>
  );
}
