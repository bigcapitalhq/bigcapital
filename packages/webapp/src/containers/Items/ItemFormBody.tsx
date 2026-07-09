import { FormGroup, Checkbox, ControlGroup } from '@blueprintjs/core';
import { useFormikContext, FastField, ErrorMessage } from 'formik';
import React from 'react';
import intl from 'react-intl-universal';
import { useItemFormContext } from './ItemFormProvider';
import {
  sellDescriptionFieldShouldUpdate,
  sellAccountFieldShouldUpdate,
  sellPriceFieldShouldUpdate,
  costPriceFieldShouldUpdate,
  costAccountFieldShouldUpdate,
  purchaseDescFieldShouldUpdate,
  taxRateFieldShouldUpdate,
} from './utils';
import type { ItemFormValues } from './types';
import {
  AccountsSelect,
  FMoneyInputGroup,
  Col,
  Row,
  Hint,
  InputPrependText,
  FFormGroup,
  FTextArea,
} from '@/components';
import { FormattedMessage as T } from '@/components';
import { TaxRatesSelect } from '@/components/TaxRates/TaxRatesSelect';
import { ACCOUNT_PARENT_TYPE } from '@/constants/accountTypes';
import { useCurrentOrganizationBaseCurrency } from '@/hooks/query';

type CheckboxField = {
  name: string;
  value: boolean;
  onChange: (e: unknown) => void;
  onBlur: (e: unknown) => void;
};

/**
 * Item form body (legacy layout — superseded by ItemFormFields).
 */
function ItemFormBodyInner() {
  const baseCurrency = useCurrentOrganizationBaseCurrency();

  const { accounts, taxRates } = useItemFormContext();
  const { values } = useFormikContext<ItemFormValues>();

  return (
    <div className="page-form__section page-form__section--selling-cost">
      <Row>
        <Col xs={6}>
          {/*------------- Sellable checbox ------------- */}
          <FastField name={'sellable'} type="checkbox">
            {({ field }: { field: CheckboxField }) => {
              const { value, ...fieldRest } = field;
              return (
                <FormGroup inline={true} className={'form-group--sellable'}>
                  <Checkbox
                    inline={true}
                    labelElement={
                      <h3>
                        <T id={'i_sell_this_item'} />
                      </h3>
                    }
                    checked={value}
                    {...fieldRest}
                  />
                </FormGroup>
              );
            }}
          </FastField>

          {/*------------- Selling price ------------- */}
          <FFormGroup
            name={'sellPrice'}
            label={intl.get('selling_price')}
            inline={true}
            fastField
          >
            <ControlGroup>
              <InputPrependText text={baseCurrency} />
              <FMoneyInputGroup
                name={'sellPrice'}
                shouldUpdate={sellPriceFieldShouldUpdate}
                inputGroupProps={{ fill: true }}
                disabled={!values.sellable}
                fastField
              />
            </ControlGroup>
          </FFormGroup>

          {/*------------- Selling account ------------- */}
          <FFormGroup
            label={intl.get('account')}
            name={'sellAccountId'}
            labelInfo={
              <Hint content={intl.get('item.field.sell_account.hint')} />
            }
            inline={true}
          >
            <AccountsSelect
              name={'sellAccountId'}
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
          <FFormGroup name={'sellTaxRateId'} label={'Tax Rate'} inline={true}>
            <TaxRatesSelect
              name={'sellTaxRateId'}
              items={taxRates}
              allowCreate
            />
          </FFormGroup>

          <FFormGroup
            name={'sellDescription'}
            label={intl.get('description')}
            inline={true}
            fastField
          >
            <FTextArea
              name={'sellDescription'}
              growVertically={true}
              disabled={!values.sellable}
              fill
              fastField
              shouldUpdate={sellDescriptionFieldShouldUpdate}
            />
          </FFormGroup>
        </Col>

        <Col xs={6}>
          {/*------------- Purchasable checkbox ------------- */}
          <FastField name={'purchasable'} type={'checkbox'}>
            {({ field }: { field: CheckboxField }) => {
              const { value, ...fieldRest } = field;
              return (
                <FormGroup inline={true} className={'form-group--purchasable'}>
                  <Checkbox
                    inline={true}
                    labelElement={
                      <h3>
                        <T id={'i_purchase_this_item'} />
                      </h3>
                    }
                    checked={value}
                    {...fieldRest}
                  />
                </FormGroup>
              );
            }}
          </FastField>

          {/*------------- Cost price ------------- */}
          <FFormGroup
            name={'costPrice'}
            label={intl.get('cost_price')}
            inline={true}
            fastField
          >
            <ControlGroup>
              <InputPrependText text={baseCurrency} />

              <FMoneyInputGroup
                name={'costPrice'}
                shouldUpdate={costPriceFieldShouldUpdate}
                inputGroupProps={{ medium: true }}
                disabled={!values.purchasable}
                fastField
              />
            </ControlGroup>
          </FFormGroup>

          {/*------------- Cost account ------------- */}
          <FFormGroup
            name={'costAccountId'}
            label={intl.get('account')}
            labelInfo={
              <Hint content={intl.get('item.field.cost_account.hint')} />
            }
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
          <FFormGroup
            name={'purchaseTaxRateId'}
            label={'Tax Rate'}
            inline={true}
          >
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
            label={intl.get('description')}
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
        </Col>
      </Row>
    </div>
  );
}

export const ItemFormBody = ItemFormBodyInner;
