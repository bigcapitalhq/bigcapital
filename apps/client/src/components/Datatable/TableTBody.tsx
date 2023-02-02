// @ts-nocheck
import React, { useContext } from 'react';
import { ScrollSyncPane } from 'react-scroll-sync';
import TableContext from './TableContext';

export default function TableTBody({
  children
}) {
  const {
    table: { getTableBodyProps }
  } = useContext(TableContext);

  return (
    <ScrollSyncPane>
      <div {...getTableBodyProps()} className="tbody">
        <div class="tbody-inner">
          { children }
        </div>
      </div>
    </ScrollSyncPane>
  );
}
