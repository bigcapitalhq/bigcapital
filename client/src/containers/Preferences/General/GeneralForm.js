import { Form } from 'formik';
import React from 'react';
import {
  Button,
  FormGroup,
  InputGroup,
  Intent,
  Position,
} from '@blueprintjs/core';
import classNames from 'classnames';
import { TimezonePicker } from '@blueprintjs/timezone';
import { ErrorMessage, FastField } from 'formik';
import { DateInput } from '@blueprintjs/datetime';
import { useHistory } from 'react-router-dom';

import { FormattedMessage as T } from 'components';
import { ListSelect, FieldRequiredHint } from 'components';
import {
  inputIntent,
  momentFormatter,
  tansformDateValue,
  handleDateChange,
} from 'utils';
import { CLASSES } from 'common/classes';
import { getCountries } from 'common/countries';
import { getCurrencies } from 'common/currencies';
import { getFiscalYear } from 'common/fiscalYearOptions';
import { getLanguages } from 'common/languagesOptions';
import { getDateFormats } from 'common/dateFormatsOptions';

export default function PreferencesGeneralForm({}) {
  const history = useHistory();

  const FiscalYear = getFiscalYear();
  const Countries = getCountries();
  const Languages = getLanguages();
  const Currencies = getCurrencies();
  const DataFormats = getDateFormats();

  const handleCloseClick = () => {
    history.go(-1);
  };

  return (
    <Form>
      {/* ---------- Organization name ----------  */}
      <FastField name={'name'}>
        {({ field, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'organization_name'} />}
            labelInfo={<FieldRequiredHint />}
            inline={true}
            intent={inputIntent({ error, touched })}
            className={'form-group--org-name'}
            helperText={<T id={'shown_on_sales_forms_and_purchase_orders'} />}
          >
            <InputGroup medium={'true'} {...field} />
          </FormGroup>
        )}
      </FastField>

      {/* ---------- Financial starting date ----------  */}
      <FastField name={'financial_date_start'}>
        {({ form, field: { value }, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'financial_starting_date'} />}
            labelInfo={<FieldRequiredHint />}
            inline={true}
            intent={inputIntent({ error, touched })}
            className={classNames('form-group--select-list', CLASSES.FILL)}
            helperText={<T id={'for_reporting_you_can_specify_any_month'} />}
          >
            <DateInput
              {...momentFormatter('MMMM Do YYYY')}
              value={tansformDateValue(value)}
              onChange={handleDateChange((formattedDate) => {
                form.setFieldValue('financial_date_start', formattedDate);
              })}
              popoverProps={{ position: Position.BOTTOM, minimal: true }}
            />
          </FormGroup>
        )}
      </FastField>

      <FastField name={'industry'}>
        {({ field, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'organization_industry'} />}
            inline={true}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name="industry" />}
            className={'form-group--org-industry'}
          >
            <InputGroup medium={'true'} {...field} />
          </FormGroup>
        )}
      </FastField>

      {/* ---------- Location ---------- */}
      <FastField name={'location'}>
        {({ form, field: { value }, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'business_location'} />}
            className={classNames(
              'form-group--business-location',
              CLASSES.FILL,
            )}
            inline={true}
            helperText={<ErrorMessage name="location" />}
            intent={inputIntent({ error, touched })}
          >
            <ListSelect
              items={Countries}
              onItemSelect={({ value }) => {
                form.setFieldValue('location', value);
              }}
              selectedItem={value}
              selectedItemProp={'value'}
              defaultText={<T id={'select_business_location'} />}
              textProp={'name'}
              popoverProps={{ minimal: true }}
            />
          </FormGroup>
        )}
      </FastField>

      {/* ----------  Base currency ----------  */}
      <FastField name={'base_currency'}>
        {({ form, field: { value }, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'base_currency'} />}
            labelInfo={<FieldRequiredHint />}
            className={classNames('form-group--base-currency', CLASSES.FILL)}
            inline={true}
            intent={inputIntent({ error, touched })}
            helperText={
              <T
                id={
                  'you_can_t_change_the_base_currency_as_there_are_transactions'
                }
              />
            }
          >
            <ListSelect
              items={Currencies}
              onItemSelect={(currency) => {
                form.setFieldValue('base_currency', currency.code);
              }}
              selectedItem={value}
              selectedItemProp={'code'}
              defaultText={<T id={'select_base_currency'} />}
              textProp={'name'}
              labelProp={'code'}
              popoverProps={{ minimal: true }}
            />
          </FormGroup>
        )}
      </FastField>

      {/* --------- Fiscal Year ----------- */}
      <FastField name={'fiscal_year'}>
        {({ form, field: { value }, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'fiscal_year'} />}
            labelInfo={<FieldRequiredHint />}
            className={classNames('form-group--fiscal-year', CLASSES.FILL)}
            inline={true}
            helperText={<ErrorMessage name="fiscal_year" />}
            intent={inputIntent({ error, touched })}
          >
            <ListSelect
              items={FiscalYear}
              onItemSelect={({ value }) =>
                form.setFieldValue('fiscal_year', value)
              }
              selectedItem={value}
              selectedItemProp={'value'}
              defaultText={<T id={'select_fiscal_year'} />}
              textProp={'name'}
              popoverProps={{ minimal: true }}
            />
          </FormGroup>
        )}
      </FastField>

      {/* ---------- Language ---------- */}
      <FastField name={'language'}>
        {({ form, field: { value }, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'language'} />}
            labelInfo={<FieldRequiredHint />}
            inline={true}
            className={classNames('form-group--language', CLASSES.FILL)}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name="language" />}
          >
            <ListSelect
              items={Languages}
              selectedItemProp={'value'}
              textProp={'name'}
              defaultText={<T id={'select_language'} />}
              selectedItem={value}
              onItemSelect={(item) =>
                form.setFieldValue('language', item.value)
              }
              popoverProps={{ minimal: true }}
            />
          </FormGroup>
        )}
      </FastField>

      {/* ----------  Time zone ----------  */}
      <FastField name={'time_zone'}>
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
            helperText={<ErrorMessage name="time_zone" />}
          >
            <TimezonePicker
              value={value}
              onChange={(timezone) => {
                form.setFieldValue('time_zone', timezone);
              }}
              valueDisplayFormat="composite"
              placeholder={<T id={'select_time_zone'} />}
            />
          </FormGroup>
        )}
      </FastField>

      {/* --------- Data format ----------- */}
      <FastField name={'date_format'}>
        {({ form, field: { value }, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'date_format'} />}
            labelInfo={<FieldRequiredHint />}
            inline={true}
            className={classNames('form-group--date-format', CLASSES.FILL)}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name="date_format" />}
          >
            <ListSelect
              items={DataFormats}
              onItemSelect={(dateFormat) => {
                form.setFieldValue('date_format', dateFormat.value);
              }}
              selectedItem={value}
              selectedItemProp={'value'}
              defaultText={<T id={'select_date_format'} />}
              textProp={'name'}
              labelProp={'label'}
              popoverProps={{ minimal: true }}
            />
          </FormGroup>
        )}
      </FastField>

      <div className={'card__footer'}>
        <Button intent={Intent.PRIMARY} type="submit">
          <T id={'save'} />
        </Button>
        <Button onClick={handleCloseClick}>
          <T id={'close'} />
        </Button>
      </div>
    </Form>
  );
}
