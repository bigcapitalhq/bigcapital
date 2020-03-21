import React, {useState, useEffect, useMemo} from 'react';
import FinancialSheet from 'components/FinancialSheet';
import DataTable from 'components/DataTable';
import {compose} from 'utils';
import moment from 'moment';
import JournalConnect from 'connectors/Journal.connect';
import {
  getFinancialSheet,
} from 'store/financialStatement/financialStatements.selectors';
import {connect} from 'react-redux';

function JournalSheetTable({
  journalIndex,
  journalTableData,
}) {
  const columns = useMemo(() => [
    {
      Header: 'Date',
      accessor: r => moment(r.date).format('YYYY/MM/DD'),
      className: 'date',
    },
    {
      Header: 'Account Name',
      accessor: 'account.name',
    },
    {
      Header: 'Transaction Type',
      accessor: 'transaction_type',
      className: "transaction_type",
    },
    {
      Header: 'Num.',
      accessor: 'reference_id',
      className: 'reference_id',
    },
    {
      Header: 'Note',
      accessor: 'note',
    },
    {
      Header: 'Credit',
      accessor: 'credit',
    },
    {
      Header: 'Debit',
      accessor: 'debit',
    },
  ], []);

  return (
    <FinancialSheet
      companyTitle={'Facebook, Incopration'}
      sheetType={'Balance Sheet'}
      date={[]}>
      
      <DataTable
        columns={columns}
        data={journalTableData} />

    </FinancialSheet>
  );
}

const mapStateToProps = (state, props) => {
  const journalTableData = [];
  const journalSheet = getFinancialSheet(state.financialStatements.journalSheets, props.journalIndex);

  if (journalSheet && journalSheet.journal) {
    journalSheet.journal.forEach((journal) => {
      journal.entries.forEach((entry, index) => {
        journalTableData.push({ ...entry, index });
      });
      journalTableData.push({
        credit: journal.credit,
        debit: journal.debit,
        total: true,
      })
    })
  }
  return {
    journalSheet,
    journalTableData,
  }
}

export default compose(
  connect(mapStateToProps),
  JournalConnect,
)(JournalSheetTable);