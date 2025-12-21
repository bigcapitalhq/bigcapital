// @ts-nocheck
import React, { useMemo } from 'react';
import intl from 'react-intl-universal';
import moment from 'moment';
import { FastField, ErrorMessage } from 'formik';
import { HTMLSelect, FormGroup, Position } from '@blueprintjs/core';

import { Row, Col, Hint, FDateInput, FFormGroup } from '@/components';
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
          <FFormGroup
            name={'fromDate'}
            label={intl.get('from_date')}
            labelInfo={<Hint />}
            fill
            fastField
          >
            <FDateInput
              name={'fromDate'}
              {...momentFormatter('YYYY-MM-DD')}
              popoverProps={{ minimal: true, position: Position.BOTTOM_LEFT }}
              maxDate={FINANCIAL_REPORT_MAX_DATE}
              canClearSelection={false}
              minimal
              fill
            />
          </FFormGroup>
        </Col>

        <Col xs={4}>
          <FFormGroup
            name={'toDate'}
            label={intl.get('to_date')}
            labelInfo={<Hint />}
            fill
            fastField
          >
            <FDateInput
              name={'toDate'}
              {...momentFormatter('YYYY-MM-DD')}
              popoverProps={{ minimal: true, position: Position.BOTTOM }}
              canClearSelection={false}
              fill
              minimal
              maxDate={FINANCIAL_REPORT_MAX_DATE}
            />
          </FFormGroup>
        </Col>
      </Row>
    </>
  );
}
