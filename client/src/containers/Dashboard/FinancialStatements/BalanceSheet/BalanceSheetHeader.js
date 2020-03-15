import React, {useState, useMemo} from 'react';
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
} from "@blueprintjs/core";
import {Select} from '@blueprintjs/select';
import {DateInput} from '@blueprintjs/datetime';
import {useIntl} from 'react-intl';
import {momentFormatter, handleStringChange} from 'utils';
import moment from 'moment';

export default function BalanceSheetHeader({
  onSubmitFilter,
}) {
  const intl = useIntl();
  const [filter, setFilter] = useState({
    from_date: null,
    to_date: null,
    accounting_basis: 'cash',
    display_columns_by: 'total',
  });

  const setFilterByName = (name, value) => {
    setFilter({
      ...filter,
      [name]: value,
    });
  };

  const handleFieldChange = (event) => {
    setFilterByName(event.target.name, event.target.value);
  };

  const displayColumnsByOptions = [
    {key: 'total', name: 'Total'},
    {key: 'year', name: 'Year'},
    {key: 'month', name: 'Month'},
    {key: 'week', name: 'Week'},
    {key: 'day', name: 'Day'},
    {key: 'quarter', name: 'Quarter'}
  ];

  const selectedDisplayColumnOpt = useMemo(() => {
    return displayColumnsByOptions.find(o => o.key === filter.display_columns_by);
  }, [filter.display_columns_by, displayColumnsByOptions]);

  // Account type item of select filed.
  const accountTypeItem = (item, { handleClick, modifiers, query }) => {
    return (<MenuItem text={item.name} key={item.id} onClick={handleClick} />);
  };
  
  const onItemSelectDisplayColumns = (item) => {
    setFilterByName('display_columns_by', item.key);
  };

  const handleDateChange = (name) => (date) => {
    setFilterByName(name, moment(date).format('YYYY-MM-DD'));
  };

  const handleSubmitClick = () => {
    onSubmitFilter(filter);
  };

  const dateRangeOptions = [
    {value: 'today', label: 'Today', },
    {value: 'this_week', label: 'This Week'},
    {value: 'this_month', label: 'This Month'},
    {value: 'this_quarter', label: 'This Quarter'},
    {value: 'this_year', label: 'This Year'},
  ];

  return (
    <FinancialStatementHeader>
      <Row>
        <Col sm={4}>
          <FormGroup
            label={intl.formatMessage({'id': 'report_date_range'})}
            minimal={true}
            fill={true}>

            <HTMLSelect
              fill={true}
              options={dateRangeOptions} />
          </FormGroup>
        </Col>

        <Col sm={4}>
          <FormGroup
            label={intl.formatMessage({'id': 'from_date'})}
            minimal={true}
            fill={true}>

            <DateInput
              {...momentFormatter('YYYY/MM/DD')}
              defaultValue={new Date()}
              onChange={handleDateChange('from_date')}
              popoverProps={{ position: Position.BOTTOM }}
              fill={true} />
          </FormGroup>
        </Col>

        <Col sm={4}>
          <FormGroup
            label={intl.formatMessage({'id': 'to_date'})}
            minimal={true}
            fill={true}>

            <DateInput
              {...momentFormatter('YYYY/MM/DD')}
              defaultValue={new Date()}
              onChange={handleDateChange('to_date')}
              popoverProps={{ position: Position.BOTTOM }}
              fill={true} />
          </FormGroup>
        </Col>
      </Row>

      <Row>
        <Col sm={4}>
          <FormGroup
            label={'Display report columns'}
            className="{'form-group-display-columns-by'}"
            inline={true}>

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

        <Col sm={4}>
          <RadioGroup
            inline={true}
            label={intl.formatMessage({'id': 'accounting_basis'})}
            name="accounting_bahandleRadioChangesis"
            selectedValue={filter.accounting_basis}
            onChange={handleStringChange((value) => {
              setFilterByName('accounting_basis', value);
            })}
          >
              <Radio label="Cash" value="cash" />
              <Radio label="Accural" value="accural" />
          </RadioGroup>
        </Col>

        <Col sm={4}>
        <Button intent={Intent.PRIMARY} type="submit" onClick={handleSubmitClick}>
          { 'Calculate Report' }
        </Button>
        </Col>
      </Row>
    </FinancialStatementHeader>
  )
}