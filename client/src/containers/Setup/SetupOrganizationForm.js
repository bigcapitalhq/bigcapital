import React from 'react';
import { FastField, Form, ErrorMessage } from 'formik';
import {
  Button,
  Intent,
  FormGroup,
  InputGroup,
  MenuItem,
  Classes,
  Position,
} from '@blueprintjs/core';
import { DateInput } from '@blueprintjs/datetime';
import classNames from 'classnames';
import { TimezonePicker } from '@blueprintjs/timezone';
import { FormattedMessage as T } from 'react-intl';

import { Col, Row, ListSelect } from 'components';
import {
  momentFormatter,
  tansformDateValue,
  inputIntent,
  handleDateChange
} from 'utils';

import fiscalYearOptions from 'common/fiscalYearOptions';
import languages from 'common/languagesOptions';
import currencies from 'common/currencies';


/**
 * Setup organization form.
 */
export default function SetupOrganizationForm({ isSubmitting, values }) {
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
            helperText={<ErrorMessage name={'organization_name'} />}
          >
            <InputGroup {...field} />
          </FormGroup>
        )}
      </FastField>

      {/* ---------- Financial starting date ----------  */}
      <FastField name={'financialDateStart'}>
        {({ form: { setFieldValue }, field: { value }, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'financial_starting_date'} />}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name="financialDateStart" />}
            className={classNames('form-group--select-list', Classes.FILL)}
          >
            <DateInput
              {...momentFormatter('YYYY MMMM DD')}
              value={tansformDateValue(value)}
              popoverProps={{ position: Position.BOTTOM, minimal: true }}
              onChange={handleDateChange((formattedDate) => {
                setFieldValue('financialDateStart', formattedDate);
              })}
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
                  noResults={<MenuItem disabled={true} text="No results." />}
                  popoverProps={{ minimal: true }}
                  onItemSelect={(item) => {
                    setFieldValue('baseCurrency', item.code);
                  }}
                  selectedItemProp={'code'}
                  textProp={'label'}
                  defaultText={<T id={'select_base_currency'} />}
                  selectedItem={value}
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
                  items={languages}
                  noResults={<MenuItem disabled={true} text="No results." />}
                  onItemSelect={(item) => {
                    setFieldValue('language', item.value);
                  }}
                  selectedItem={value}
                  textProp={'name'}
                  selectedItemProp={'value'}
                  defaultText={<T id={'select_language'} />}
                  popoverProps={{ minimal: true }}
                />
              </FormGroup>
            )}
          </FastField>
        </Col>
      </Row>
      {/* --------- Fiscal Year ----------- */}
      <FastField name={'fiscalYear'}>
        {({ form: { setFieldValue }, field: { value }, meta: { error, touched } }) => (
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
              items={fiscalYearOptions}
              noResults={<MenuItem disabled={true} text="No results." />}
              selectedItem={value}
              selectedItemProp={'value'}
              textProp={'name'}
              defaultText={<T id={'select_fiscal_year'} />}
              popoverProps={{ minimal: true }}
              onItemSelect={(item) => {
                setFieldValue('fiscalYear', item.value)
              }}
            />
          </FormGroup>
        )}
      </FastField>

      {/* ----------  Time zone ----------  */}
      <FastField name={'timeZone'}>
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
            helperText={<ErrorMessage name={'timeZone'} />}
          >
            <TimezonePicker
              value={value}
              onChange={(item) => {
                setFieldValue('timeZone', item);
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
        <T
          id={
            'note_you_can_change_your_preferences_later_in_dashboard_if_needed'
          }
        />
      </p>

      <div className={'register-org-button'}>
        <Button
          intent={Intent.PRIMARY}
          disabled={isSubmitting}
          loading={isSubmitting}
          type="submit"
        >
          <T id={'save_continue'} />
        </Button>
      </div>
    </Form>
  );
}
