import React from 'react';

import { FastField, Field } from 'formik';
import { FormGroup, Checkbox } from '@blueprintjs/core';
import styled from 'styled-components';

import { Row, Col, FieldHint, FormattedMessage as T } from 'components';
import {
  handlePreviousYearCheckBoxChange,
  handlePreviousYearChangeCheckboxChange,
  handlePreviousPeriodCheckBoxChange,
  handlePreivousPeriodPercentageCheckboxChange,
  handlePreviousYearPercentageCheckboxChange,
  handlePreviousPeriodChangeCheckboxChange,
} from './utils';

/**
 * Balance sheet header - Comparison panal.
 */
export default function BalanceSheetHeaderComparisonPanal() {
  return (
    <BalanceSheetComparisonWrap>
      {/**----------- Previous Year -----------*/}
      <Field name={'previousYear'} type={'checkbox'}>
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
          <Field name={'previousYearAmountChange'} type={'checkbox'}>
            {({ form, field }) => (
              <FormGroup labelInfo={<FieldHint />}>
                <Checkbox
                  inline={true}
                  small={true}
                  label={<T id={'balance_sheet.total_change'} />}
                  {...field}
                  onChange={handlePreviousYearChangeCheckboxChange(form)}
                />
              </FormGroup>
            )}
          </Field>
        </Col>
        <Col xs={3}>
          <FastField name={'previousYearPercentageChange'} type={'checkbox'}>
            {({ form, field }) => (
              <FormGroup labelInfo={<FieldHint />}>
                <Checkbox
                  inline={true}
                  label={<T id={'balance_sheet.change'} />}
                  {...field}
                  onChange={handlePreviousYearPercentageCheckboxChange(form)}
                />
              </FormGroup>
            )}
          </FastField>
        </Col>
      </Row>
      {/*------------ Previous Period -----------*/}
      <FastField name={'previousPeriod'} type={'checkbox'}>
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
          <FastField name={'previousPeriodAmountChange'} type={'checkbox'}>
            {({ form, field }) => (
              <FormGroup labelInfo={<FieldHint />}>
                <Checkbox
                  inline={true}
                  small={true}
                  label={<T id={'balance_sheet.total_change'} />}
                  {...field}
                  onChange={handlePreviousPeriodChangeCheckboxChange(form)}
                />
              </FormGroup>
            )}
          </FastField>
        </Col>
        <Col xs={3}>
          <FastField name={'previousPeriodPercentageChange'} type={'checkbox'}>
            {({ form, field }) => (
              <FormGroup labelInfo={<FieldHint />}>
                <Checkbox
                  inline={true}
                  label={<T id={'balance_sheet.change'} />}
                  {...field}
                  onChange={handlePreivousPeriodPercentageCheckboxChange(form)}
                />
              </FormGroup>
            )}
          </FastField>
        </Col>
      </Row>

      {/**----------- % of Column -----------*/}
      <FastField name={'percentageOfColumn'} type={'checkbox'}>
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
      <FastField name={'percentageOfRow'} type={'checkbox'}>
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
