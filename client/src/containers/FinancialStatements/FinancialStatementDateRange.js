import React, {useState, useCallback, useMemo} from 'react';
import {Row, Col} from 'react-grid-system';
import {momentFormatter} from 'utils';
import {DateInput} from '@blueprintjs/datetime';
import {useIntl} from 'react-intl';
import {
  HTMLSelect,
  FormGroup, 
  Intent,
  Position,
} from '@blueprintjs/core';
import Icon from 'components/Icon';
import {
  parseDateRangeQuery
} from 'utils';

export default function FinancialStatementDateRange({
  formik,
}) {
  const intl = useIntl();
  const [reportDateRange, setReportDateRange] = useState('this_year');

  const dateRangeOptions = useMemo(() => [
    {value: 'today', label: 'Today', },
    {value: 'this_week', label: 'This Week'},
    {value: 'this_month', label: 'This Month'},
    {value: 'this_quarter', label: 'This Quarter'},
    {value: 'this_year', label: 'This Year'},
    {value: 'custom', label: 'Custom Range'},
  ], []);

  const handleDateChange = useCallback((name) => (date) => {
    setReportDateRange('custom');
    formik.setFieldValue(name, date);
  }, [setReportDateRange, formik]);

  // Handles date range field change.
  const handleDateRangeChange = useCallback((e) => {
    const value = e.target.value;
    if (value !== 'custom') {
      const dateRange = parseDateRangeQuery(value);
      if (dateRange) {
        formik.setFieldValue('from_date', dateRange.from_date);
        formik.setFieldValue('to_date', dateRange.to_date);
      }
    }
    setReportDateRange(value);
  }, [formik]);

  const infoIcon = useMemo(() => (<Icon icon="info-circle" iconSize={12} />), []);

  return (
    <Row>
      <Col sm={3}>
        <FormGroup
          label={intl.formatMessage({'id': 'report_date_range'})}
          labelInfo={infoIcon}
          minimal={true}
          fill={true}>

          <HTMLSelect
            fill={true}
            options={dateRangeOptions}
            value={reportDateRange}
            onChange={handleDateRangeChange} />
        </FormGroup>
      </Col>

      <Col sm={3}>
        <FormGroup
          label={intl.formatMessage({'id': 'from_date'})}
          labelInfo={infoIcon}
          minimal={true}
          fill={true}
          intent={formik.errors.from_date && Intent.DANGER}>

          <DateInput
            {...momentFormatter('YYYY/MM/DD')}
            value={formik.values.from_date}
            onChange={handleDateChange('from_date')}
            popoverProps={{ position: Position.BOTTOM }}
            fill={true} />
        </FormGroup>
      </Col>

      <Col sm={3}>
        <FormGroup
          label={intl.formatMessage({'id': 'to_date'})}
          labelInfo={infoIcon}
          minimal={true}
          fill={true}
          intent={formik.errors.to_date && Intent.DANGER}>

          <DateInput
            {...momentFormatter('YYYY/MM/DD')}
            value={formik.values.to_date}
            onChange={handleDateChange('to_date')}
            popoverProps={{ position: Position.BOTTOM }}
            fill={true}
            intent={formik.errors.to_date && Intent.DANGER} />
        </FormGroup>
      </Col>
    </Row>
  );
}