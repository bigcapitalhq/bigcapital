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
 * ProfitLoss sheet header -comparison panel.
 */
export default function ProfitLossSheetHeaderComparisonPanel() {
  return (
    <ProfitLossSheetComparisonWrap>
      {/**----------- Previous Year -----------*/}
      <FastField name={'previous_year'} type={'checkbox'}>
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
          <FastField name={'previous_year_amount_change'} type={'checkbox'}>
            {({ form: { setFieldValue }, field }) => (
              <FormGroup labelInfo={<FieldHint />}>
                <Checkbox
                  inline={true}
                  small={true}
                  label={<T id={'profit_loss_sheet.total_change'} />}
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
          </FastField>
        </Col>
        <Col xs={3}>
          <FastField name={'previous_year_percentage_change'} type={'checkbox'}>
            {({ form: { setFieldValue }, field }) => (
              <FormGroup labelInfo={<FieldHint />}>
                <Checkbox
                  inline={true}
                  small={true}
                  label={<T id={'profit_loss_sheet.perentage_change'} />}
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
      {/**----------- Previous Period (PP) -----------*/}
      <FastField name={'previous_period'} type={'checkbox'}>
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
          <FastField name={'previous_period_amount_change'} type={'checkbox'}>
            {({ form: { setFieldValue }, field }) => (
              <FormGroup labelInfo={<FieldHint />}>
                <Checkbox
                  inline={true}
                  small={true}
                  label={<T id={'profit_loss_sheet.total_change'} />}
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
                  small={true}
                  label={<T id={'profit_loss_sheet.perentage_change'} />}
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
      <FastField name={'percentage_column'} type={'checkbox'}>
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
      <FastField name={'percentage_row'} type={'checkbox'}>
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
      <FastField name={'percentage_expense'} type={'checkbox'}>
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
      <FastField name={'percentage_income'} type={'checkbox'}>
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
