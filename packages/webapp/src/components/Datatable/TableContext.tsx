import { createContext } from 'react';
import type { TableContextValue } from './types';

const TableContext = createContext<TableContextValue<any>>(
  {} as TableContextValue<any>,
);

export default TableContext;
