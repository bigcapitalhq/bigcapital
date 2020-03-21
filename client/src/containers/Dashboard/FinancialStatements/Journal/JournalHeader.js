import React, {useState, useMemo, useEffect} from 'react';
import FinancialStatementHeader from 'containers/Dashboard/FinancialStatements/FinancialStatementHeader';
import {Row, Col} from 'react-grid-system';
import {
  Button,
  FormGroup,
  Position,
  HTMLSelect,
  Intent,
} from '@blueprintjs/core';
import {DateInput} from '@blueprintjs/datetime';
import moment from 'moment';
import {
  momentFormatter,
  parseDateRangeQuery,
} from 'utils';
import {useIntl} from 'react-intl';

export default function JournalHeader({
  pageFilter,
  onSubmitFilter,
}) {
  const intl = useIntl();

  const [filter, setFilter] = useState({
    ...pageFilter,
    from_date: moment(pageFilter.from_date).toDate(),
    to_date: moment(pageFilter.to_date).toDate()
  });

  const setFilterByKey = (name, value) => {
    setFilter({ ...filter, [name]: value });
  };
  const [reportDateRange, setReportDateRange] = useState('this_year');
  const dateRangeOptions = [
    {value: 'today', label: 'Today', },
    {value: 'this_week', label: 'This Week'},
    {value: 'this_month', label: 'This Month'},
    {value: 'this_quarter', label: 'This Quarter'},
    {value: 'this_year', label: 'This Year'},
    {value: 'custom', label: 'Custom Range'},
  ];
  const handleDateChange = (name) => (date) => {
    setReportDateRange('custom');
    setFilterByKey(name, date);
  };

  useEffect(() => {
    if (reportDateRange === 'custom') { return; }
    const dateRange = parseDateRangeQuery(reportDateRange);

    if (dateRange) {
      setFilter((filter) => ({ ...filter, ...dateRange }));
    }
  }, [reportDateRange]);
  
  const handleSubmitClick = () => { onSubmitFilter(filter); };
  
  return (
    <FinancialStatementHeader>
      <Row>
        <Col sm={3}>
          <FormGroup
            label={intl.formatMessage({'id': 'report_date_range'})}
            minimal={true}
            fill={true}>

            <HTMLSelect
              fill={true}
              options={dateRangeOptions}
              value={reportDateRange}
              onChange={(event) => setReportDateRange(event.target.value)} />
          </FormGroup>
        </Col>

        <Col sm={3}>
          <FormGroup
            label={intl.formatMessage({'id': 'from_date'})}
            minimal={true}
            fill={true}>

            <DateInput
              {...momentFormatter('YYYY/MM/DD')}
              value={filter.from_date}
              onChange={handleDateChange('from_date')}
              popoverProps={{ position: Position.BOTTOM }}
              fill={true} />
          </FormGroup>
        </Col>

        <Col sm={3}>
          <FormGroup
            label={intl.formatMessage({'id': 'to_date'})}
            minimal={true}
            fill={true}>

            <DateInput
              {...momentFormatter('YYYY/MM/DD')}
              value={filter.to_date}
              onChange={handleDateChange('to_date')}
              popoverProps={{ position: Position.BOTTOM }}
              fill={true} />
          </FormGroup>
        </Col>
      </Row>

      <Row>
        <Col sm={3}>
          <Button
            intent={Intent.PRIMARY}
            type="submit"
            onClick={handleSubmitClick}>
            { 'Run Report' }
          </Button>
        </Col>
      </Row>

    </FinancialStatementHeader>
  );
}