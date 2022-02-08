import React from 'react';

import { FastField, Field } from 'formik';
import { FormGroup, Checkbox } from '@blueprintjs/core';
import styled from 'styled-components';

import { FormattedMessage as T } from 'components';

import { Row, Col, FieldHint } from '../../../components';
import {
  handlePreviousYearCheckBoxChange,
  handlePreviousPeriodCheckBoxChange,
} from './utils';

/**
 * Balance sheet header - Comparison panal.
 */
export default function BalanceSheetHeaderComparisonPanal() {
  return (
    <BalanceSheetComparisonWrap>
      {/**----------- Previous Year -----------*/}
      <Field name={'previous_year'} type={'checkbox'}>
        {({ form, field }) => (
          <FormGroup labelInfo={<FieldHint />}>
            <Checkbox
              inline={true}
              label={<T id={'balance_sheet.previous_year'} />}
              {...field}
              onChange={handlePreviousYearCheckBoxChange(form)}
            />
          </FormGroup>
        )}
      </Field>
      <Row>
        <Col xs={3}>
          <Field name={'previous_year_amount_change'} type={'checkbox'}>
            {({ form: { setFieldValue }, field }) => (
              <FormGroup labelInfo={<FieldHint />}>
                <Checkbox
                  inline={true}
                  small={true}
                  label={<T id={'balance_sheet.total_change'} />}
                  {...field}
                  onChange={({ currentTarget }) => {
                    setFieldValue('previous_year', currentTarget.checked);
                    setFieldValue(
                      'previous_year_amount_change',
                      currentTarget.checked,
                    );
                  }}
                />
              </FormGroup>
            )}
          </Field>
        </Col>
        <Col xs={3}>
          <FastField name={'previous_year_percentage_change'} type={'checkbox'}>
            {({ form: { setFieldValue }, field }) => (
              <FormGroup labelInfo={<FieldHint />}>
                <Checkbox
                  inline={true}
                  label={<T id={'balance_sheet.change'} />}
                  {...field}
                  onChange={({ currentTarget }) => {
                    setFieldValue('previous_year', currentTarget.checked);
                    setFieldValue(
                      'previous_year_percentage_change',
                      currentTarget.checked,
                    );
                  }}
                />
              </FormGroup>
            )}
          </FastField>
        </Col>
      </Row>
      {/*------------ Previous Period -----------*/}
      <FastField name={'previous_period'} type={'checkbox'}>
        {({ form, field }) => (
          <FormGroup labelInfo={<FieldHint />}>
            <Checkbox
              inline={true}
              small={true}
              label={<T id={'balance_sheet.previous_period'} />}
              {...field}
              onChange={handlePreviousPeriodCheckBoxChange(form)}
            />
          </FormGroup>
        )}
      </FastField>
      <Row>
        <Col xs={3}>
          <FastField name={'previous_period_amount_change'} type={'checkbox'}>
            {({ form: { setFieldValue }, field }) => (
              <FormGroup labelInfo={<FieldHint />}>
                <Checkbox
                  inline={true}
                  small={true}
                  label={<T id={'balance_sheet.total_change'} />}
                  {...field}
                  onChange={({ currentTarget }) => {
                    setFieldValue('previous_period', currentTarget.checked);
                    setFieldValue(
                      'previous_period_amount_change',
                      currentTarget.checked,
                    );
                  }}
                />
              </FormGroup>
            )}
          </FastField>
        </Col>
        <Col xs={3}>
          <FastField
            name={'previous_period_percentage_change'}
            type={'checkbox'}
          >
            {({ form: { setFieldValue }, field }) => (
              <FormGroup labelInfo={<FieldHint />}>
                <Checkbox
                  inline={true}
                  label={<T id={'balance_sheet.change'} />}
                  {...field}
                  onChange={({ currentTarget }) => {
                    setFieldValue('previous_period', currentTarget.checked);
                    setFieldValue(
                      'previous_period_percentage_change',
                      currentTarget.checked,
                    );
                  }}
                />
              </FormGroup>
            )}
          </FastField>
        </Col>
      </Row>

      {/**----------- % of Column -----------*/}
      <FastField name={'percentage_of_column'} type={'checkbox'}>
        {({ field }) => (
          <FormGroup labelInfo={<FieldHint />}>
            <Checkbox
              inline={true}
              small={true}
              label={<T id={'balance_sheet.percentage_of_column'} />}
              {...field}
            />
          </FormGroup>
        )}
      </FastField>

      {/**----------- % of Row -----------*/}
      <FastField name={'percentage_of_row'} type={'checkbox'}>
        {({ field }) => (
          <FormGroup labelInfo={<FieldHint />}>
            <Checkbox
              inline={true}
              small={true}
              label={<T id={'balance_sheet.percentage_of_row'} />}
              {...field}
            />
          </FormGroup>
        )}
      </FastField>
    </BalanceSheetComparisonWrap>
  );
}

const BalanceSheetComparisonWrap = styled.div`
  .row {
    margin-left: 0.15rem;
    .col {
      min-width: 150px !important;
      max-width: 190px !important;
    }
  }
  .bp3-form-group {
    margin-bottom: 3px;
  }
`;
