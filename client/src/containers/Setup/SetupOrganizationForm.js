import React from 'react';
import { FastField, Form, ErrorMessage } from 'formik';
import {
  Button,
  Intent,
  FormGroup,
  InputGroup,
  MenuItem,
  Classes,
} from '@blueprintjs/core';
import classNames from 'classnames';
import { TimezonePicker } from '@blueprintjs/timezone';
import { FormattedMessage as T } from 'components';
import { getCountries } from 'common/countries';

import { Col, Row, ListSelect } from 'components';
import { inputIntent } from 'utils';

import { getFiscalYear } from 'common/fiscalYearOptions';
import { getLanguages } from 'common/languagesOptions';
import { getAllCurrenciesOptions } from 'common/currencies';

/**
 * Setup organization form.
 */
export default function SetupOrganizationForm({ isSubmitting, values }) {
  const FiscalYear = getFiscalYear();
  const Languages = getLanguages();
  const currencies = getAllCurrenciesOptions();
  const countries = getCountries();

  return (
    <Form>
      <h3>
        <T id={'organization_details'} />
      </h3>

      {/* ---------- Organization name ----------  */}
      <FastField name={'name'}>
        {({ form, field, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'legal_organization_name'} />}
            className={'form-group--name'}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name={'name'} />}
          >
            <InputGroup {...field} intent={inputIntent({ error, touched })} />
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
              Classes.FILL,
            )}
            helperText={<ErrorMessage name="location" />}
            intent={inputIntent({ error, touched })}
          >
            <ListSelect
              items={countries}
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

      <Row>
        <Col xs={6}>
          {/* ----------  Base currency ----------  */}
          <FastField name={'baseCurrency'}>
            {({
              form: { setFieldValue },
              field: { value },
              meta: { error, touched },
            }) => (
              <FormGroup
                label={<T id={'base_currency'} />}
                className={classNames(
                  'form-group--base-currency',
                  'form-group--select-list',
                  Classes.FILL,
                )}
                intent={inputIntent({ error, touched })}
                helperText={<ErrorMessage name={'baseCurrency'} />}
              >
                <ListSelect
                  items={currencies}
                  noResults={
                    <MenuItem disabled={true} text={<T id={'no_results'} />} />
                  }
                  popoverProps={{ minimal: true }}
                  onItemSelect={(item) => {
                    setFieldValue('baseCurrency', item.key);
                  }}
                  selectedItemProp={'key'}
                  textProp={'name'}
                  defaultText={<T id={'select_base_currency'} />}
                  selectedItem={value}
                  intent={inputIntent({ error, touched })}
                />
              </FormGroup>
            )}
          </FastField>
        </Col>

        {/* ---------- Language ---------- */}
        <Col xs={6}>
          <FastField name={'language'}>
            {({
              form: { setFieldValue },
              field: { value },
              meta: { error, touched },
            }) => (
              <FormGroup
                label={<T id={'language'} />}
                className={classNames(
                  'form-group--language',
                  'form-group--select-list',
                  Classes.FILL,
                )}
                intent={inputIntent({ error, touched })}
                helperText={<ErrorMessage name={'language'} />}
              >
                <ListSelect
                  items={Languages}
                  noResults={
                    <MenuItem disabled={true} text={<T id={'no_results'} />} />
                  }
                  onItemSelect={(item) => {
                    setFieldValue('language', item.value);
                  }}
                  selectedItem={value}
                  textProp={'name'}
                  selectedItemProp={'value'}
                  defaultText={<T id={'select_language'} />}
                  popoverProps={{ minimal: true }}
                  filterable={false}
                  intent={inputIntent({ error, touched })}
                />
              </FormGroup>
            )}
          </FastField>
        </Col>
      </Row>
      {/* --------- Fiscal Year ----------- */}
      <FastField name={'fiscalYear'}>
        {({
          form: { setFieldValue },
          field: { value },
          meta: { error, touched },
        }) => (
          <FormGroup
            label={<T id={'fiscal_year'} />}
            className={classNames(
              'form-group--fiscal_year',
              'form-group--select-list',
              Classes.FILL,
            )}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name={'fiscalYear'} />}
          >
            <ListSelect
              items={FiscalYear}
              noResults={
                <MenuItem disabled={true} text={<T id={'no_results'} />} />
              }
              selectedItem={value}
              selectedItemProp={'key'}
              textProp={'name'}
              defaultText={<T id={'select_fiscal_year'} />}
              popoverProps={{ minimal: true }}
              onItemSelect={(item) => {
                setFieldValue('fiscalYear', item.key);
              }}
              filterable={false}
            />
          </FormGroup>
        )}
      </FastField>

      {/* ----------  Time zone ----------  */}
      <FastField name={'timezone'}>
        {({
          form: { setFieldValue },
          field: { value },
          meta: { error, touched },
        }) => (
          <FormGroup
            label={<T id={'time_zone'} />}
            className={classNames(
              'form-group--time-zone',
              'form-group--select-list',
              Classes.FILL,
            )}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name={'timezone'} />}
          >
            <TimezonePicker
              value={value}
              onChange={(item) => {
                setFieldValue('timezone', item);
              }}
              valueDisplayFormat="composite"
              showLocalTimezone={true}
              placeholder={<T id={'select_time_zone'} />}
              popoverProps={{ minimal: true }}
            />
          </FormGroup>
        )}
      </FastField>

      <p className={'register-org-note'}>
        <T id={'setup.organization.note_you_can_change_your_preferences'} />
      </p>

      <div className={'register-org-button'}>
        <Button intent={Intent.PRIMARY} loading={isSubmitting} type="submit">
          <T id={'save_continue'} />
        </Button>
      </div>
    </Form>
  );
}
