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

interface FinancialStatementDateRangeProps {
  allDatesLabel?: string;
}

interface ReportDateRangeValues {
  dateRange?: string;
  fromDate: Date | string | null;
  toDate: Date | string | null;
}

export function FinancialStatementDateRange({
  allDatesLabel,
}: FinancialStatementDateRangeProps) {
  const dateInputFormatter = useDateInputFormatter();
  const { values, setValues } = useFormikContext<ReportDateRangeValues>();

  const selectedDateRange = useMemo(() => {
    if (
      allDatesLabel &&
      !values.fromDate &&
      !values.toDate &&
      values.dateRange !== 'custom'
    ) {
      return 'all_dates';
    }
    return resolveDateRange(values.dateRange, values.fromDate, values.toDate);
  }, [allDatesLabel, values.dateRange, values.fromDate, values.toDate]);

  const options = allDatesLabel
    ? [{ value: 'all_dates', label: allDatesLabel }, ...dateRangeOptions]
    : dateRangeOptions;

  return (
    <>
      <Row>
        <Col xs={4}>
          <FormGroup
            label={intl.get('report_date_range')}
            labelFor="report-date-range"
            labelInfo={<Hint />}
          >
            <HTMLSelect
              id="report-date-range"
              fill={true}
              options={options}
              value={selectedDateRange}
              onChange={(e) => {
                const newValue = e.target.value;

                if (newValue === 'custom') {
                  setValues({ ...values, dateRange: newValue });
                } else if (newValue === 'all_dates') {
                  setValues({
                    ...values,
                    dateRange: newValue,
                    fromDate: '',
                    toDate: '',
                  });
                } else {
                  const range = parseDateRangeQuery(newValue);
                  setValues({
                    ...values,
                    dateRange: newValue,
                    fromDate: moment(range.fromDate).toDate(),
                    toDate: moment(range.toDate).toDate(),
                  });
                }
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
              canClearSelection={Boolean(allDatesLabel)}
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
              canClearSelection={Boolean(allDatesLabel)}
              fill
              maxDate={FINANCIAL_REPORT_MAX_DATE}
            />
          </FFormGroup>
        </Col>
      </Row>
    </>
  );
}
