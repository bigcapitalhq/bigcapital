import React from 'react';
import { FastField, Field } from 'formik';
import { FormGroup, Checkbox } from '@blueprintjs/core';
import styled from 'styled-components';

import { FormattedMessage as T } from 'components';

import { Row, Col, FieldHint } from '../../../components';

/**
 * Balance sheet header - Comparison panal.
 */
export default function BalanceSheetHeaderComparisonPanal() {
  return (
    <BalanceSheetComparisonWrap>
      {/**----------- Previous Year -----------*/}
      <FastField name={'previous_year'} type={'checkbox'}>
        {({ field }) => (
          <FormGroup labelInfo={<FieldHint />}>
            <Checkbox
              inline={true}
              small={true}
              label={<T id={'balance_sheet.previous_year'} />}
              {...field}
            />
          </FormGroup>
        )}
      </FastField>
      <Row>
        <Col xs={3}>
          <FastField name={'previous_year_amount_change'} type={'checkbox'}>
            {({ field }) => (
              <FormGroup labelInfo={<FieldHint />}>
                <Checkbox
                  inline={true}
                  small={true}
                  label={<T id={'balance_sheet.total_change'} />}
                  {...field}
                />
              </FormGroup>
            )}
          </FastField>
        </Col>
        <Col xs={3}>
          <FastField name={'previous_year_percentage_change'} type={'checkbox'}>
            {({ field }) => (
              <FormGroup labelInfo={<FieldHint />}>
                <Checkbox
                  inline={true}
                  small={true}
                  label={<T id={'balance_sheet.change'} />}
                  {...field}
                />
              </FormGroup>
            )}
          </FastField>
        </Col>
      </Row>
      {/*------------ Previous Period -----------*/}
      <FastField name={'previous_period'} type={'checkbox'}>
        {({ field }) => (
          <FormGroup labelInfo={<FieldHint />}>
            <Checkbox
              inline={true}
              small={true}
              label={<T id={'balance_sheet.previous_period'} />}
              {...field}
            />
          </FormGroup>
        )}
      </FastField>
      <Row>
        <Col xs={3}>
          <FastField name={'previous_period_amount_change'} type={'checkbox'}>
            {({ field }) => (
              <FormGroup labelInfo={<FieldHint />}>
                <Checkbox
                  inline={true}
                  small={true}
                  label={<T id={'balance_sheet.total_change'} />}
                  {...field}
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
            {({ field }) => (
              <FormGroup labelInfo={<FieldHint />}>
                <Checkbox
                  inline={true}
                  small={true}
                  label={<T id={'balance_sheet.change'} />}
                  {...field}
                />
              </FormGroup>
            )}
          </FastField>
        </Col>
      </Row>
      
      {/**----------- % of Column -----------*/}
      <FastField name={'previous_period_percentage_change'} type={'checkbox'}>
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
      <FastField name={'previous_period_percentage_change'} type={'checkbox'}>
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
    </BalanceSheetComparisonWrap>
  );
}

const BalanceSheetComparisonWrap = styled.div`
  .row {
    margin-left: 0.15rem;
    .col {
      min-width: 150px;
      max-width: 190px;
    }
  }
  .bp3-form-group {
    margin-bottom: 3px;
    /* margin-bottom: 0; */
  }
`;
