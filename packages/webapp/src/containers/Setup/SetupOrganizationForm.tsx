// @ts-nocheck
import React from 'react';
import { FastField, Form, ErrorMessage } from 'formik';
import { Button, Intent, FormGroup, Classes } from '@blueprintjs/core';
import classNames from 'classnames';
import { TimezonePicker } from '@blueprintjs/timezone';
import { getAllCountries } from '@bigcapital/utils';
import {
  FFormGroup,
  FInputGroup,
  FSelect,
  FormattedMessage as T,
} from '@/components';

import { Col, Row } from '@/components';
import { inputIntent } from '@/utils';

import { getFiscalYear } from '@/constants/fiscalYearOptions';
import { getLanguages } from '@/constants/languagesOptions';
import { getAllCurrenciesOptions } from '@/constants/currencies';

const countries = getAllCountries();

/**
 * Setup organization form.
 */
export default function SetupOrganizationForm({ isSubmitting, values }) {
  const FiscalYear = getFiscalYear();
  const Languages = getLanguages();
  const currencies = getAllCurrenciesOptions();

  return (
    <Form>
      <h3>
        <T id={'organization_details'} />
      </h3>
      {/* ---------- Organization name ----------  */}
      <FFormGroup
        name={'name'}
        label={<T id={'legal_organization_name'} />}
        fastField={true}
      >
        <FInputGroup name={'name'} fastField={true} />
      </FFormGroup>

      {/* ---------- Location ---------- */}
      <FFormGroup
        name={'location'}
        label={<T id={'business_location'} />}
        fastField={true}
      >
        <FSelect
          name={'location'}
          items={countries}
          valueAccessor={'countryCode'}
          textAccessor={'name'}
          placeholder={<T id={'select_business_location'} />}
          popoverProps={{ minimal: true }}
          fastField={true}
        />
      </FFormGroup>

      <Row>
        <Col xs={6}>
          {/* ----------  Base currency ----------  */}
          <FFormGroup
            name={'baseCurrency'}
            label={<T id={'base_currency'} />}
            fastField={true}
          >
            <FSelect
              name={'baseCurrency'}
              items={currencies}
              popoverProps={{ minimal: true }}
              valueAccessor={'key'}
              textAccessor={'name'}
              placeholder={<T id={'select_base_currency'} />}
              fastField={true}
            />
          </FFormGroup>
        </Col>

        {/* ---------- Language ---------- */}
        <Col xs={6}>
          <FFormGroup
            name={'language'}
            label={<T id={'language'} />}
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
          </FFormGroup>
        </Col>
      </Row>

      {/* --------- Fiscal Year ----------- */}
      <FFormGroup
        name={'fiscalYear'}
        label={<T id={'fiscal_year'} />}
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
