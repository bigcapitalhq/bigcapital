import React, {useState, useMemo} from 'react';
import DataTable from 'components/DataTable';
import {
  FormGroup,
  InputGroup,
  MenuItem,
  Button,
  Intent,
} from '@blueprintjs/core';
import {Select} from '@blueprintjs/select';
import Icon from 'components/Icon';
import AccountsConnect from 'connectors/Accounts.connector.js';
import {compose} from 'utils';

function MakeJournalEntriesTable({
  formik,
  accounts,
}) {
  const [selectAccountsState, setSelectedAccount] = useState(false);

  // Account item of select accounts field.
  const accountItem = (item, { handleClick, modifiers, query }) => {
    return (<MenuItem text={item.name} label={item.code} key={item.id} onClick={handleClick} />)
  };

  // Filters accounts options by account name or code.
  const filterAccountsPredicater = (query, account, _index, exactMatch) => {
    const normalizedTitle = account.name.toLowerCase();
    const normalizedQuery = query.toLowerCase();

    if (exactMatch) {
      return normalizedTitle === normalizedQuery;
    } else {
      return `${account.code} ${normalizedTitle}`.indexOf(normalizedQuery) >= 0;
    }
  };

  // Handle account field change.
  const onChangeAccount = (index) => (account) => {
    setSelectedAccount({
      ...selectAccountsState,
      [index + 1]: account,
    });
    formik.setFieldValue(`entries[${index}].account_id`, account.id);
  };

  const [data, setData] = useState([
    ...formik.values.entries,
  ]);

  const updateData = (rowIndex, columnId, value) => {
    setData((old) =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...old[rowIndex],
            [columnId]: value,
          }
        }
        return row
      })
    )
  }

  const CellInputGroupRenderer = ({
    row: { index },
    column: { id },
    cell: { value: initialValue },
  }) => {
    const [state, setState] = useState(initialValue);

    return (
     <InputGroup
        fill={true}
        value={state}
        onChange={(event) => {
          setState(event.target.value);
        }}
        onBlur={(event) => {
          formik.setFieldValue(`entries[${index}].[${id}]`, event.target.value);
          updateData(index, id, state);
        }}
      />);
  }


  const ActionsCellRenderer = ({
    row: { index },
    column: { id },
    cell: { value: initialValue },
  }) => {

    const onClickRemoveRole = () => {

    };

    return (
      <Button 
        icon={<Icon icon="mines" />}
        iconSize={14}
        className="ml2"
        minimal={true}
        intent={Intent.DANGER}
        onClick={onClickRemoveRole()} />
    );
  }
 
  const columns = useMemo(() => [
    {
      Header: '#',
      accessor: 'index',
      Cell: ({ row: {index} }) => (
        <span>{ index + 1 }</span>
      ),
      className: "actions",
    },
    {
      Header: 'Account',
      accessor: 'account',
      Cell: ({ row: { index } }) => (
        <FormGroup
          className="{'form-group--account'}"
          inline={true}>
          <Select
            items={accounts}
            noResults={<MenuItem disabled={true} text="No results." />}
            itemRenderer={accountItem}
            itemPredicate={filterAccountsPredicater}
            popoverProps={{ minimal: true }}
            onItemSelect={onChangeAccount(index)}>
 
            <Button
              rightIcon="caret-down"
              text={(selectAccountsState[(index + 1)])
                ? selectAccountsState[(index + 1)].name : "Select Account"}
            />
          </Select>
        </FormGroup>
      ),
      className: "account",
    },
    {
      Header: 'Note', 
      accessor: 'note',
      Cell: CellInputGroupRenderer,
      className: "note",
    },
    {
      Header: 'Credit',
      accessor: 'credit',
      Cell: CellInputGroupRenderer,
      className: "credit",
    },
    {
      Header: 'Debit',
      accessor: 'debit',
      Cell: CellInputGroupRenderer,
      className: "debit",
    },
    {
      Header: '',
      accessor: 'action',
      Cell: ActionsCellRenderer,
      className: "actions",
    }
  ]);

  const onClickNewRow = () => {
    setData([
      ...data,
      {
        credit: 0,
        debit: 0,
        account_id: null,
        note: '',
      }
    ]);
  }
  return (
    <div class="make-journal-entries__table">
      <DataTable
        columns={columns}
        data={data} />

      <div class="mt1">
        <Button
          minimal={true}
          intent={Intent.PRIMARY}
          onClick={onClickNewRow}>
          + New Entry
        </Button>

        <Button
          minimal={true}
          intent={Intent.PRIMARY}
          onClick={onClickNewRow}>
          - Clear all entries
        </Button>
      </div>
    </div>
  );
}

export default compose(
  AccountsConnect,
)(MakeJournalEntriesTable);