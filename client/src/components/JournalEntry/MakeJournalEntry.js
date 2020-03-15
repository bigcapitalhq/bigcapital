import React from 'react';
import {
  FormGroup,
  MenuItem,
  Intent,
  InputGroup,
  Position,
  Button,
} from '@blueprintjs/core';
import { DateInput, TimePrecision } from "@blueprintjs/datetime";
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Inject,
  Sort,
} from '@syncfusion/ej2-react-grids';
import {momentFormatter} from 'utils';

export default function MakeJournalEntry({
  accounts,
  currencies,
}) {

  const handleDateChange = () => {

  };

  const handleClose = () => {

  };

  const columns = [
    {
      headerText: 'Account',
    },
    {
      headerText: 'Description',
    },
    {
      headerText: 'Account',
    },
    {
      headerText: 'Debit',
    },
    {
      headerText: 'Credit',
    }
  ];

  return (
    <div class="make-journal-entry">
      <div class="make-journal-entry__details">
        <FormGroup
          label={'Date'}
          inline={true}>

          <DateInput
            {...momentFormatter('MM/DD/YYYY')}
            defaultValue={new Date()}
            onChange={handleDateChange}
            popoverProps={{ position: Position.BOTTOM }}
          />
        </FormGroup>

        <GridComponent>
          <ColumnsDirective>
            {columns.map((column) => {
              return (<ColumnDirective
                field={column.field}
                headerText={column.headerText}
                template={column.template}
                allowSorting={true}
                customAttributes={column.customAttributes}
                />);
              })}
          </ColumnsDirective>
        </GridComponent>

        <div class="form__floating-footer">
          <Button onClick={handleClose}>Close</Button>
          <Button intent={Intent.PRIMARY} type="submit">
            { 'Save and Publish' }
          </Button>

          <Button intent={Intent.PRIMARY} type="submit">
            { 'Save as Draft' }
          </Button>
        </div>

      </div>
    </div>
  )
}