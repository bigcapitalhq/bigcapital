// @ts-nocheck
import React from 'react';
import styled from 'styled-components';
import { FastField } from 'formik';
import { FormGroup, Checkbox } from '@blueprintjs/core';

import { Flex, FlexItem, FieldHint, FormattedMessage as T } from '@/components';

import {
  handlePreviousYearCheckBoxChange,
  handlePreviousPeriodCheckBoxChange,
  handlePreviousYearChangeCheckboxChange,
  handlePreviousYearPercentageCheckboxChange,
  handlePreviousPeriodChangeCheckboxChange,
  handlePreviousPeriodPercentageCheckboxChange,
} from './utils';

/**
 * Profit/loss comparisons panel fields.
 * @returns {JSX.Element}
 */
function ProfitLossComparisonPanelFields() {
  return (
    <>
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

      <FlexSubFields>
        <FlexItem col={6}>
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
        </FlexItem>
        <FlexItem col={6}>
          <FastField name={'previousYearPercentageChange'} type={'checkbox'}>
            {({ form, field }) => (
              <FormGroup labelInfo={<FieldHint />}>
                <Checkbox
                  inline={true}
                  small={true}
                  label={<T id={'profit_loss_sheet.percentage_change'} />}
                  {...field}
                  onChange={handlePreviousYearPercentageCheckboxChange(form)}
                />
              </FormGroup>
            )}
          </FastField>
        </FlexItem>
      </FlexSubFields>

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

      <FlexSubFields>
        <FlexItem col={6}>
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
        </FlexItem>
        <FlexItem col={6}>
          <FastField name={'previousPeriodPercentageChange'} type={'checkbox'}>
            {({ form, field }) => (
              <FormGroup labelInfo={<FieldHint />}>
                <Checkbox
                  inline={true}
                  small={true}
                  label={<T id={'profit_loss_sheet.percentage_change'} />}
                  {...field}
                  onChange={handlePreviousPeriodPercentageCheckboxChange(form)}
                />
              </FormGroup>
            )}
          </FastField>
        </FlexItem>
      </FlexSubFields>

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
    </>
  );
}

/**
 * ProfitLoss sheet header -comparison panel.
 */
export default function ProfitLossSheetHeaderComparisonPanel() {
  return (
    <ProfitLossSheetComparisonWrap>
      <ProfitLossComparisonFieldsWrap>
        <ProfitLossComparisonPanelFields />
      </ProfitLossComparisonFieldsWrap>
    </ProfitLossSheetComparisonWrap>
  );
}

const ProfitLossSheetComparisonWrap = styled.div`
  .bp3-form-group {
    margin-bottom: 3px;
  }
`;

const FlexSubFields = styled(Flex)`
  padding-left: 20px;
`;

const ProfitLossComparisonFieldsWrap = styled.div`
  max-width: 400px;
`;
