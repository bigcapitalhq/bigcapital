// @ts-nocheck
import React from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import { Form } from 'formik';
import { Button, FormGroup, Intent } from '@blueprintjs/core';
import { TimezonePicker } from '@blueprintjs/timezone';
import { ErrorMessage, FastField } from 'formik';
import { useHistory } from 'react-router-dom';
import { getAllCountries } from '@bigcapital/utils';

import {
  FieldRequiredHint,
  FormattedMessage as T,
  FFormGroup,
  FInputGroup,
  FSelect,
  Stack,
  Group,
} from '@/components';
import { inputIntent } from '@/utils';
import { CLASSES } from '@/constants/classes';
import { getAllCurrenciesOptions } from '@/constants/currencies';
import { getFiscalYear } from '@/constants/fiscalYearOptions';
import { getLanguages } from '@/constants/languagesOptions';
import { useGeneralFormContext } from './GeneralFormProvider';

import { shouldBaseCurrencyUpdate } from './utils';

const Countries = getAllCountries();
/**
 * Preferences general form.
 */
export default function PreferencesGeneralForm({ isSubmitting }) {
  const history = useHistory();

  const FiscalYear = getFiscalYear();
  const Languages = getLanguages();
  const Currencies = getAllCurrenciesOptions();

  const { dateFormats, baseCurrencyMutateAbility } = useGeneralFormContext();

  const baseCurrencyDisabled = baseCurrencyMutateAbility.length > 0;

  // Handle close click.
  const handleCloseClick = () => {
    history.go(-1);
  };

  return (
    <Form>
      {/* ---------- Organization name ----------  */}
      <FFormGroup
        name={'name'}
        label={<T id={'organization_name'} />}
        labelInfo={<FieldRequiredHint />}
        inline={true}
        helperText={<T id={'shown_on_sales_forms_and_purchase_orders'} />}
        fastField={true}
      >
        <FInputGroup medium={'true'} name={'name'} fastField={true} />
      </FFormGroup>

      {/* ---------- Organization Tax Number ----------  */}
      <FFormGroup
        name={'tax_number'}
        label={<T id={'organization_tax_number'} />}
        inline={true}
        helperText={<T id={'shown_on_sales_forms_and_purchase_orders'} />}
        fastField={true}
      >
        <FInputGroup medium={'true'} name={'tax_number'} fastField={true} />
      </FFormGroup>

      {/* ---------- Industry ----------  */}
      <FFormGroup
        name={'industry'}
        label={<T id={'organization_industry'} />}
        inline={true}
        fastField={true}
      >
        <FInputGroup name={'industry'} medium={'true'} fastField={true} />
      </FFormGroup>

      {/* ---------- Location ---------- */}
      <FFormGroup
        name={'location'}
        label={<T id={'business_location'} />}
        inline={true}
        fastField={true}
      >
        <FSelect
          name={'location'}
          items={Countries}
          valueAccessor={'countryCode'}
          labelAccessor={'countryCode'}
          textAccessor={'name'}
          placeholder={<T id={'select_business_location'} />}
          popoverProps={{ minimal: true }}
          fastField={true}
        />
      </FFormGroup>

      {/* ---------- Address ---------- */}
      <FFormGroup
        name={'address'}
        label={'Organization Address'}
        inline
        fastField
      >
        <Stack>
          <FInputGroup
            name={'address.address_1'}
            placeholder={'Address 1'}
            fastField
          />
          <FInputGroup
            name={'address.address_2'}
            placeholder={'Address 2'}
            fastField
          />
          <Group spacing={15}>
            <FInputGroup name={'address.city'} placeholder={'City'} fastField />
            <FInputGroup
              name={'address.postal_code'}
              placeholder={'ZIP Code'}
              fastField
            />
          </Group>
          <Group spacing={15}>
            <FInputGroup
              name={'address.state_province'}
              placeholder={'State or Province'}
              fastField
            />
            <FInputGroup
              name={'address.phone'}
              placeholder={'Phone number'}
              fastField
            />
          </Group>
        </Stack>
      </FFormGroup>

      {/* ----------  Base currency ----------  */}
      <FFormGroup
        name={'base_currency'}
        baseCurrencyDisabled={baseCurrencyDisabled}
        label={<T id={'base_currency'} />}
        labelInfo={<FieldRequiredHint />}
        inline={true}
        helperText={
          <T
            id={'you_can_t_change_the_base_currency_as_there_are_transactions'}
          />
        }
        fastField={true}
        shouldUpdate={shouldBaseCurrencyUpdate}
      >
        <FSelect
          name={'base_currency'}
          items={Currencies}
          valueAccessor={'key'}
          textAccessor={'name'}
          labelAccessor={'key'}
          placeholder={<T id={'select_base_currency'} />}
          popoverProps={{ minimal: true }}
          disabled={baseCurrencyDisabled}
          fastField={true}
          shouldUpdate={shouldBaseCurrencyUpdate}
          baseCurrencyDisabled={baseCurrencyDisabled}
        />
      </FFormGroup>

      {/* --------- Fiscal Year ----------- */}
      <FFormGroup
        name={'fiscal_year'}
        label={<T id={'fiscal_year'} />}
        labelInfo={<FieldRequiredHint />}
        inline={true}
        helperText={<T id={'for_reporting_you_can_specify_any_month'} />}
        fastField={true}
      >
        <FSelect
          name={'fiscal_year'}
          items={FiscalYear}
          valueAccessor={'key'}
          textAccessor={'name'}
          placeholder={<T id={'select_fiscal_year'} />}
          popoverProps={{ minimal: true }}
          fastField={true}
        />
      </FFormGroup>

      {/* ---------- Language ---------- */}
      <FormGroup
        name={'language'}
        label={<T id={'language'} />}
        labelInfo={<FieldRequiredHint />}
        inline={true}
        fastField={true}
      >
        <FSelect
          name={'language'}
          items={Languages}
          valueAccessor={'value'}
          textAccessor={'name'}
          placeholder={<T id={'select_language'} />}
          popoverProps={{ minimal: true }}
          fastField={true}
        />
      </FormGroup>

      {/* ----------  Time zone ----------  */}
      <FastField name={'timezone'}>
        {({ form, field: { value }, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'time_zone'} />}
            labelInfo={<FieldRequiredHint />}
            inline={true}
            className={classNames(
              'form-group--time-zone',
              CLASSES.FORM_GROUP_LIST_SELECT,
              CLASSES.FILL,
            )}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name="timezone" />}
          >
            <TimezonePicker
              value={value}
              onChange={(timezone) => {
                form.setFieldValue('timezone', timezone);
              }}
              valueDisplayFormat="composite"
              placeholder={<T id={'select_time_zone'} />}
            />
          </FormGroup>
        )}
      </FastField>

      {/* --------- Data format ----------- */}
      <FFormGroup
        name={'date_format'}
        label={<T id={'date_format'} />}
        labelInfo={<FieldRequiredHint />}
        inline={true}
        helperText={<ErrorMessage name="date_format" />}
        fastField={true}
      >
        <FSelect
          name={'date_format'}
          items={dateFormats}
          valueAccessor={'key'}
          textAccessor={'label'}
          placeholder={<T id={'select_date_format'} />}
          popoverProps={{ minimal: true }}
          fastField={true}
        />
      </FFormGroup>

      <CardFooterActions>
        <Button loading={isSubmitting} intent={Intent.PRIMARY} type="submit">
          <T id={'save'} />
        </Button>
        <Button onClick={handleCloseClick}>
          <T id={'close'} />
        </Button>
      </CardFooterActions>
    </Form>
  );
}

const CardFooterActions = styled.div`
  padding-top: 16px;
  border-top: 1px solid #e0e7ea;
  margin-top: 30px;

  .bp4-button {
    min-width: 70px;

    + .bp4-button {
      margin-left: 10px;
    }
  }
`;
