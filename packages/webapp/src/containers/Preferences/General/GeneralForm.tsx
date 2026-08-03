// @ts-nocheck
import { getAllCountries } from '@bigcapital/utils';
import { Button, FormGroup, Intent } from '@blueprintjs/core';
import { TimezonePicker, getTimezoneMetadata } from '@blueprintjs/timezone';
import classNames from 'classnames';
import { ErrorMessage, Form, useFormikContext } from 'formik';
import React from 'react';
import intl from 'react-intl-universal';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { useGeneralFormContext } from './GeneralFormProvider';
import { shouldBaseCurrencyUpdate } from './utils';
import type { GeneralFormValues } from './types';
import {
  FieldRequiredHint,
  FormattedMessage as T,
  FFormGroup,
  FInputGroup,
  FSelect,
  Stack,
  Group,
} from '@/components';
import { SelectButton } from '@/components/Forms/Select';
import { CLASSES } from '@/constants/classes';
import { getAllCurrenciesOptions } from '@/constants/currencies';
import { getFiscalYear } from '@/constants/fiscalYearOptions';
import { getLanguages } from '@/constants/languagesOptions';
import { inputIntent } from '@/utils';

const Countries = getAllCountries();

export interface PreferencesGeneralFormProps {
  isSubmitting: boolean;
}

/**
 * Preferences general form.
 */
export function PreferencesGeneralForm({
  isSubmitting,
}: PreferencesGeneralFormProps) {
  const history = useHistory();

  const FiscalYear = getFiscalYear();
  const Languages = getLanguages();
  const Currencies = getAllCurrenciesOptions();

  const { dateFormats, baseCurrencyMutateAbility } = useGeneralFormContext()!;

  const baseCurrencyDisabled = (baseCurrencyMutateAbility ?? []).length > 0;

  // Handle close click.
  const handleCloseClick = () => {
    history.go(-1);
  };

  return (
    <Form>
      {/* ---------- Organization name ----------  */}
      <FFormGroup
        name={'name'}
        label={intl.get('organization_name')}
        labelInfo={<FieldRequiredHint />}
        inline={true}
        helperText={<T id={'shown_on_sales_forms_and_purchase_orders'} />}
        fastField={true}
      >
        <FInputGroup medium={true} name={'name'} fastField={true} />
      </FFormGroup>

      {/* ---------- Organization Tax Number ----------  */}
      <FFormGroup
        name={'taxNumber'}
        label={intl.get('organization_tax_number')}
        inline={true}
        helperText={<T id={'shown_on_sales_forms_and_purchase_orders'} />}
        fastField={true}
      >
        <FInputGroup medium={true} name={'taxNumber'} fastField={true} />
      </FFormGroup>

      {/* ---------- Industry ----------  */}
      <FFormGroup
        name={'industry'}
        label={intl.get('organization_industry')}
        inline={true}
        fastField={true}
      >
        <FInputGroup name={'industry'} medium={true} fastField={true} />
      </FFormGroup>

      {/* ---------- Location ---------- */}
      <FFormGroup
        name={'location'}
        label={intl.get('business_location')}
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
            name={'address.address1'}
            placeholder={'Address 1'}
            fastField
          />
          <FInputGroup
            name={'address.address2'}
            placeholder={'Address 2'}
            fastField
          />
          <Group spacing={15}>
            <FInputGroup name={'address.city'} placeholder={'City'} fastField />
            <FInputGroup
              name={'address.postalCode'}
              placeholder={'ZIP Code'}
              fastField
            />
          </Group>
          <Group spacing={15}>
            <FInputGroup
              name={'address.stateProvince'}
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
        name={'baseCurrency'}
        baseCurrencyDisabled={baseCurrencyDisabled}
        label={intl.get('base_currency')}
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
          name={'baseCurrency'}
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
        name={'fiscalYear'}
        label={intl.get('fiscal_year')}
        labelInfo={<FieldRequiredHint />}
        inline={true}
        helperText={<T id={'for_reporting_you_can_specify_any_month'} />}
        fastField={true}
      >
        <FSelect
          name={'fiscalYear'}
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
        label={intl.get('language')}
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

      {/* --------- Timezone ----------- */}
      <TimezoneField />

      {/* --------- Data format ----------- */}
      <FFormGroup
        name={'dateFormat'}
        label={intl.get('date_format')}
        labelInfo={<FieldRequiredHint />}
        inline={true}
        helperText={<ErrorMessage name="dateFormat" />}
        fastField={true}
      >
        <FSelect
          name={'dateFormat'}
          items={dateFormats ?? []}
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
  --x-color-border: #e0e7ea;
  --x-color-border: rgba(255, 255, 255, 0.15);

  padding-top: 16px;
  border-top: 1px solid var(--x-color-border);
  margin-top: 30px;

  .bp4-button {
    min-width: 70px;

    + .bp4-button {
      margin-left: 10px;
    }
  }
`;

function TimezoneField() {
  const { values, setFieldValue, touched, errors } =
    useFormikContext<GeneralFormValues>();
  const value = values?.timezone;
  const error = errors?.timezone;
  const isTouched = touched?.timezone;

  const compositeLabel = React.useMemo(() => {
    const placeholder = <T id={'select_time_zone'} />;
    if (!value) return placeholder;
    try {
      const { abbreviation, offsetAsString } = getTimezoneMetadata(
        value,
        new Date(),
      );
      return `${value}${abbreviation ? ` (${abbreviation})` : ''} ${offsetAsString}`;
    } catch (e) {
      return value; // fallback
    }
  }, [value]);

  return (
    <FFormGroup
      name={'timezone'}
      label={intl.get('time_zone')}
      labelInfo={<FieldRequiredHint />}
      inline={true}
      intent={inputIntent({ error, touched: isTouched })}
      helperText={<ErrorMessage name="timezone" />}
    >
      <TimezonePicker
        value={value}
        onChange={(timezone: string) => setFieldValue('timezone', timezone)}
        popoverProps={{ minimal: true, fill: true }}
        fill
      >
        <SelectButton
          text={compositeLabel}
          className={classNames({ 'is-selected': !!value })}
          fill
        />
      </TimezonePicker>
    </FFormGroup>
  );
}
