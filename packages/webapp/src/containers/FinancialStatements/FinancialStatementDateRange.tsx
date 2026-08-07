import { HTMLSelect, FormGroup, Position } from '@blueprintjs/core';
import { FastField } from 'formik';
import moment from 'moment';
import React from 'react';
import intl from 'react-intl-universal';
import { dateRangeOptions } from './constants';
import { Row, Col, Hint, FDateInput, FFormGroup } from '@/components';
import { momentFormatter, parseDateRangeQuery } from '@/utils';

const FINANCIAL_REPORT_MAX_DATE = moment().add(5, 'years').toDate();

export function FinancialStatementDateRange() {
  return (
    <>
      <Row>
        <Col xs={4}>
          <FastField name={'date_range'}>
            {({ form: { setFieldValue }, field: { value } }: any) => (
              <FormGroup
                label={intl.get('report_date_range')}
                labelInfo={<Hint />}
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
            fastField
          >
            <FDateInput
              name={'fromDate'}
              {...momentFormatter('YYYY-MM-DD')}
              popoverProps={{ minimal: true, position: Position.BOTTOM_LEFT }}
              maxDate={FINANCIAL_REPORT_MAX_DATE}
              canClearSelection={false}
              fill
            />
          </FFormGroup>
        </Col>

        <Col xs={4}>
          <FFormGroup
            name={'toDate'}
            label={intl.get('to_date')}
            labelInfo={<Hint />}
            fastField
          >
            <FDateInput
              name={'toDate'}
              {...momentFormatter('YYYY-MM-DD')}
              popoverProps={{ minimal: true, position: Position.BOTTOM }}
              canClearSelection={false}
              fill
              maxDate={FINANCIAL_REPORT_MAX_DATE}
            />
          </FFormGroup>
        </Col>
      </Row>
    </>
  );
}
