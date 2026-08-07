import React, { useContext } from 'react';
import { ScrollSyncPane } from 'react-scroll-sync';
import TableContext from './TableContext';

interface TableTBodyProps {
  children?: React.ReactNode;
}

export default function TableTBody({ children }: TableTBodyProps) {
  const {
    table: { getTableBodyProps },
  } = useContext(TableContext);

  return (
    <ScrollSyncPane>
      <div {...getTableBodyProps()} className="tbody">
        <div className="tbody-inner">{children}</div>
      </div>
    </ScrollSyncPane>
  );
}
