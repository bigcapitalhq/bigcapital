// @ts-nocheck
import React from 'react';
import styled from 'styled-components';
import { FastField, Field } from 'formik';
import { FormGroup, Checkbox } from '@blueprintjs/core';
import { Flex, FlexItem, FieldHint, FormattedMessage as T } from '@/components';
import {
  handlePreviousYearCheckBoxChange,
  handlePreviousYearChangeCheckboxChange,
  handlePreviousPeriodCheckBoxChange,
  handlePreivousPeriodPercentageCheckboxChange,
  handlePreviousYearPercentageCheckboxChange,
  handlePreviousPeriodChangeCheckboxChange,
} from './utils';

/**
 * Balance sheet header - Comparison panel - Comparisons fields.
 */
function BalanceSheetHeaderComparisonPanelFields() {
  return (
    <>
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

      <FlexSubFields align={'left'}>
        <FlexItem col={6}>
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
        </FlexItem>

        <FlexItem col={6}>
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
        </FlexItem>
      </FlexSubFields>

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

      <FlexSubFields>
        <FlexItem col={6}>
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
        </FlexItem>

        <FlexItem col={6}>
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
        </FlexItem>
      </FlexSubFields>

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
    </>
  );
}

/**
 * Balance sheet header - Comparison panel.
 */
export default function BalanceSheetHeaderComparisonPanel() {
  return (
    <BalanceSheetComparisonWrap>
      <BalanceSheetComparisonFieldsWrap>
        <BalanceSheetHeaderComparisonPanelFields />
      </BalanceSheetComparisonFieldsWrap>
    </BalanceSheetComparisonWrap>
  );
}

const BalanceSheetComparisonWrap = styled.div`
  .bp3-form-group {
    margin-bottom: 3px;
  }
`;

const FlexSubFields = styled(Flex)`
  padding-left: 20px;
`;

const BalanceSheetComparisonFieldsWrap = styled.div`
  width: 400px;
`;
