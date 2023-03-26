// @ts-nocheck
import React, { useMemo } from 'react';
import intl from 'react-intl-universal';
import moment from 'moment';
import { FastField, ErrorMessage } from 'formik';
import { HTMLSelect, FormGroup, Intent, Position } from '@blueprintjs/core';
import { DateInput } from '@blueprintjs/datetime';

import { Row, Col, Hint } from '@/components';
import { momentFormatter, parseDateRangeQuery } from '@/utils';
import { dateRangeOptions } from './constants';

const FINANCIAL_REPORT_MAX_DATE = moment().add(5, 'years').toDate();

/**
 * Financial statement - Date range select.
 */
export default function FinancialStatementDateRange() {
  return (
    <>
      <Row>
        <Col xs={4}>
          <FastField name={'date_range'}>
            {({ form: { setFieldValue }, field: { value } }) => (
              <FormGroup
                label={intl.get('report_date_range')}
                labelInfo={<Hint />}
                minimal={true}
                fill={true}
              >
                <HTMLSelect
                  fill={true}
                  options={dateRangeOptions}
                  value={value}
                  onChange={(e) => {
                    const newValue = e.target.value;

                    if (newValue !== 'custom') {
                      const dateRange = parseDateRangeQuery(newValue);

                      if (dateRange) {
                        setFieldValue(
                          'fromDate',
                          moment(dateRange.fromDate).toDate(),
                        );
                        setFieldValue(
                          'toDate',
                          moment(dateRange.toDate).toDate(),
                        );
                      }
                    }
                    setFieldValue('dateRange', newValue);
                  }}
                />
              </FormGroup>
            )}
          </FastField>
        </Col>
      </Row>

      <Row>
        <Col xs={4}>
          <FastField name={'fromDate'}>
            {({
              form: { setFieldValue },
              field: { value },
              meta: { error, touched },
            }) => (
              <FormGroup
                label={intl.get('from_date')}
                labelInfo={<Hint />}
                fill={true}
                intent={error && Intent.DANGER}
                helperText={<ErrorMessage name={'fromDate'} />}
              >
                <DateInput
                  {...momentFormatter('YYYY-MM-DD')}
                  value={value}
                  onChange={(selectedDate) => {
                    setFieldValue('fromDate', selectedDate);
                  }}
                  popoverProps={{ minimal: true, position: Position.BOTTOM }}
                  canClearSelection={false}
                  minimal={true}
                  fill={true}
                  maxDate={FINANCIAL_REPORT_MAX_DATE}
                />
              </FormGroup>
            )}
          </FastField>
        </Col>

        <Col xs={4}>
          <FastField name={'toDate'}>
            {({
              form: { setFieldValue },
              field: { value },
              meta: { error },
            }) => (
              <FormGroup
                label={intl.get('to_date')}
                labelInfo={<Hint />}
                fill={true}
                intent={error && Intent.DANGER}
                helperText={<ErrorMessage name={'toDate'} />}
              >
                <DateInput
                  {...momentFormatter('YYYY-MM-DD')}
                  value={value}
                  onChange={(selectedDate) => {
                    setFieldValue('toDate', selectedDate);
                  }}
                  popoverProps={{ minimal: true, position: Position.BOTTOM }}
                  canClearSelection={false}
                  fill={true}
                  minimal={true}
                  intent={error && Intent.DANGER}
                  maxDate={FINANCIAL_REPORT_MAX_DATE}
                />
              </FormGroup>
            )}
          </FastField>
        </Col>
      </Row>
    </>
  );
}
