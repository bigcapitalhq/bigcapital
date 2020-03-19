import React, {useState, useMemo, useEffect} from 'react';
import FinancialStatementHeader from 'containers/Dashboard/FinancialStatements/FinancialStatementHeader';
import {Row, Col} from 'react-grid-system';
import { 
  Button,
  FormGroup,
  Position,
  MenuItem,
  RadioGroup,
  Radio,
  HTMLSelect,
  Intent,
  Popover,
} from "@blueprintjs/core";
import {Select} from '@blueprintjs/select';
import {DateInput} from '@blueprintjs/datetime';
import {useIntl} from 'react-intl';
import {
  momentFormatter,
  handleStringChange,
  parseDateRangeQuery,
} from 'utils';
import moment from 'moment';

export default function ProfitLossSheetHeader({
  onSubmitFilter,
  pageFilter,
}) {
  const intl = useIntl();
  const displayColumnsByOptions = [
    {key: 'total', name: 'Total'},
    {key: 'year', name: 'Year'},
    {key: 'month', name: 'Month'},
    {key: 'week', name: 'Week'},
    {key: 'day', name: 'Day'},
    {key: 'quarter', name: 'Quarter'},
  ];

  const [filter, setFilter] = useState({
    ...pageFilter,
    from_date: moment(pageFilter.from_date).toDate(),
    to_date: moment(pageFilter.to_date).toDate()
  });

  const setFilterByKey = (name, value) => {
    setFilter({ ...filter, [name]: value });
  };

  const [reportDateRange, setReportDateRange] = useState('this_year');

  useEffect(() => {
    if (reportDateRange === 'custom') { return; }
    const dateRange = parseDateRangeQuery(reportDateRange);

    if (dateRange) {
      setFilter((filter) => ({ ...filter, ...dateRange, }));
    }
  }, [reportDateRange])

  const selectedDisplayColumnOpt = useMemo(() => {
    return displayColumnsByOptions.find(o => o.key === filter.display_columns_by);
  }, [filter.display_columns_by, displayColumnsByOptions]);

  // Account type item of select filed.
  const accountTypeItem = (item, { handleClick, modifiers, query }) => {
    return (<MenuItem text={item.name} key={item.id} onClick={handleClick} />);
  };
   
  // Handle item select of `display columns by` field.
  const onItemSelectDisplayColumns = (item) => {
    setFilterByKey('display_columns_by', item.key);
  };

  // Handle any date change.
  const handleDateChange = (name) => (date) => {
    setReportDateRange('custom');
    setFilterByKey(name, date);
  };

  // handle submit filter submit button.
  const handleSubmitClick = () => {
    onSubmitFilter(filter);
  };
  const dateRangeOptions = [
    {value: 'today', label: 'Today', },
    {value: 'this_week', label: 'This Week'},
    {value: 'this_month', label: 'This Month'},
    {value: 'this_quarter', label: 'This Quarter'},
    {value: 'this_year', label: 'This Year'},
    {value: 'custom', label: 'Custom Range'},
  ];

  const [activeRowsColumns, setActiveRowsColumns] = useState(false);

  const onClickActiveRowsColumnsBtn = () => {
    setActiveRowsColumns(!activeRowsColumns);
  };

  const activeRowsColumnsPopover = (
    <div>
      <h5>Columns</h5>
      <RadioGroup
        name="none_zero"
        selectedValue={filter.none_zero}
        onChange={handleStringChange((value) => {          
          setFilterByKey('none_zero', value);
        })}
      >
        <Radio label="All" value="0" />
        <Radio label="Non-Zero" value="1" />
      </RadioGroup>
    </div>
  );
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
          <FormGroup
            label={'Display report columns'}
            className="{'form-group-display-columns-by'}"
            inline={false}>

            <Select
              items={displayColumnsByOptions}
              noResults={<MenuItem disabled={true} text="No results." />}
              filterable={false}
              itemRenderer={accountTypeItem}
              popoverProps={{ minimal: true }}
              onItemSelect={onItemSelectDisplayColumns}>
              <Button
                rightIcon="caret-down"
                fill={true}
                text={selectedDisplayColumnOpt ? selectedDisplayColumnOpt.name : 'Select'} />
            </Select>
          </FormGroup>
        </Col>

        <Col sm={3}>
          <FormGroup
            label={'Show non-zero or active only'}
            inline={false}>

            <Popover
              isOpen={activeRowsColumns}
              content={activeRowsColumnsPopover}
              minimal={true}
              position={Position.BOTTOM}>

              <Button
                rightIcon="caret-down"
                fill={true}
                text="Active rows/Columns Active"
                onClick={onClickActiveRowsColumnsBtn} />
            </Popover>
          </FormGroup>
        </Col>

        <Col sm={3}>
          <RadioGroup
            inline={true}
            label={intl.formatMessage({'id': 'accounting_basis'})}
            name="accounting_bahandleRadioChangesis"
            selectedValue={filter.accounting_basis}
            onChange={handleStringChange((value) => {
              setFilterByKey('accounting_basis', value);
            })}
          >
              <Radio label="Cash" value="cash" />
              <Radio label="Accural" value="accural" />
          </RadioGroup>
        </Col>

        <Col sm={3}>
          <Button intent={Intent.PRIMARY} type="submit" onClick={handleSubmitClick}>
            { 'Calculate Report' }
          </Button>
        </Col>
      </Row>
    </FinancialStatementHeader>
  )
}