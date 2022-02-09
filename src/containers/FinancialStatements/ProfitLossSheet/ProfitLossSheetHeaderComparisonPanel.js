import React from 'react';
import { FastField, Field } from 'formik';
import { FormGroup, Checkbox } from '@blueprintjs/core';
import styled from 'styled-components';

import { FormattedMessage as T } from 'components';

import { Row, Col, FieldHint } from '../../../components';
import {
  handlePreviousYearCheckBoxChange,
  handlePreviousPeriodCheckBoxChange,
  handlePreviousYearChangeCheckboxChange,
  handlePreviousYearPercentageCheckboxChange,
  handlePreviousPeriodChangeCheckboxChange,
  handlePreviousPeriodPercentageCheckboxChange,
} from './utils';

/**
 * ProfitLoss sheet header -comparison panel.
 */
export default function ProfitLossSheetHeaderComparisonPanel() {
  return (
    <ProfitLossSheetComparisonWrap>
      {/**----------- Previous Year -----------*/}
      <FastField name={'previousYear'} type={'checkbox'}>
        {({ form, field }) => (
          <FormGroup labelInfo={<FieldHint />}>
            <Checkbox
              inline={true}
              small={true}
              label={<T id={'profit_loss_sheet.previous_year'} />}
              {...field}
              onChange={handlePreviousYearCheckBoxChange(form)}
            />
          </FormGroup>
        )}
      </FastField>
      <Row>
        <Col xs={3}>
          <FastField name={'previousYearAmountChange'} type={'checkbox'}>
            {({ form, field }) => (
              <FormGroup labelInfo={<FieldHint />}>
                <Checkbox
                  inline={true}
                  small={true}
                  label={<T id={'profit_loss_sheet.total_change'} />}
                  {...field}
                  onChange={handlePreviousYearChangeCheckboxChange(form)}
                />
              </FormGroup>
            )}
          </FastField>
        </Col>
        <Col xs={3}>
          <FastField name={'previousYearPercentageChange'} type={'checkbox'}>
            {({ form, field }) => (
              <FormGroup labelInfo={<FieldHint />}>
                <Checkbox
                  inline={true}
                  small={true}
                  label={<T id={'profit_loss_sheet.perentage_change'} />}
                  {...field}
                  onChange={handlePreviousYearPercentageCheckboxChange(form)}
                />
              </FormGroup>
            )}
          </FastField>
        </Col>
      </Row>
      {/**----------- Previous Period (PP) -----------*/}
      <FastField name={'previousPeriod'} type={'checkbox'}>
        {({ form, field }) => (
          <FormGroup labelInfo={<FieldHint />}>
            <Checkbox
              inline={true}
              small={true}
              label={<T id={'profit_loss_sheet.previous_period'} />}
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
                  label={<T id={'profit_loss_sheet.total_change'} />}
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
                  small={true}
                  label={<T id={'profit_loss_sheet.perentage_change'} />}
                  {...field}
                  onChange={handlePreviousPeriodPercentageCheckboxChange(form)}
                />
              </FormGroup>
            )}
          </FastField>
        </Col>
      </Row>
      {/**----------- % of Column -----------*/}
      <FastField name={'percentageColumn'} type={'checkbox'}>
        {({ field }) => (
          <FormGroup labelInfo={<FieldHint />}>
            <Checkbox
              inline={true}
              small={true}
              label={<T id={'profit_loss_sheet.percentage_of_column'} />}
              {...field}
            />
          </FormGroup>
        )}
      </FastField>
      {/**----------- % of Row -----------*/}
      <FastField name={'percentageRow'} type={'checkbox'}>
        {({ field }) => (
          <FormGroup labelInfo={<FieldHint />}>
            <Checkbox
              inline={true}
              small={true}
              label={<T id={'profit_loss_sheet.percentage_of_row'} />}
              {...field}
            />
          </FormGroup>
        )}
      </FastField>
      {/**----------- % of Expense -----------*/}
      <FastField name={'percentageExpense'} type={'checkbox'}>
        {({ field }) => (
          <FormGroup labelInfo={<FieldHint />}>
            <Checkbox
              inline={true}
              small={true}
              label={<T id={'profit_loss_sheet.percentage_of_expense'} />}
              {...field}
            />
          </FormGroup>
        )}
      </FastField>
      {/**----------- % of Income -----------*/}
      <FastField name={'percentageIncome'} type={'checkbox'}>
        {({ field }) => (
          <FormGroup labelInfo={<FieldHint />}>
            <Checkbox
              inline={true}
              small={true}
              label={<T id={'profit_loss_sheet.percentage_of_income'} />}
              {...field}
            />
          </FormGroup>
        )}
      </FastField>
    </ProfitLossSheetComparisonWrap>
  );
}

const ProfitLossSheetComparisonWrap = styled.div`
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
