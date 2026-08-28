import { HTMLSelect, FormGroup, Position } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import moment from 'moment';
import React, { useMemo } from 'react';
import intl from 'react-intl-universal';
import { dateRangeOptions } from './constants';
import { resolveDateRange } from './dateRange';
import { Row, Col, Hint, FDateInput, FFormGroup } from '@/components';
import { useDateInputFormatter } from '@/hooks';
import { parseDateRangeQuery } from '@/utils';

const FINANCIAL_REPORT_MAX_DATE = moment().add(5, 'years').toDate();

export function FinancialStatementDateRange() {
  const dateInputFormatter = useDateInputFormatter();
  const { values, setFieldValue } = useFormikContext<any>();

  const selectedDateRange = useMemo(
    () => resolveDateRange(values.dateRange, values.fromDate, values.toDate),
    [values.dateRange, values.fromDate, values.toDate],
  );

  return (
    <>
      <Row>
        <Col xs={4}>
          <FormGroup label={intl.get('report_date_range')} labelInfo={<Hint />}>
            <HTMLSelect
              fill={true}
              options={dateRangeOptions}
              value={selectedDateRange}
              onChange={(e) => {
                const newValue = e.target.value;

                if (newValue !== 'custom') {
                  const dateRange = parseDateRangeQuery(newValue);

                  if (dateRange) {
                    setFieldValue(
                      'fromDate',
                      moment(dateRange.fromDate).toDate(),
                    );
                    setFieldValue('toDate', moment(dateRange.toDate).toDate());
                  }
                }
                setFieldValue('dateRange', newValue);
              }}
            />
          </FormGroup>
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
              {...dateInputFormatter}
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
              {...dateInputFormatter}
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
