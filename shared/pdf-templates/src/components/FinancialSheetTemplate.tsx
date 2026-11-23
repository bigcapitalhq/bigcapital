import { x } from '@xstyled/emotion';
import { Box } from '../lib/layout/Box';

export interface TableColumn {
  key: string;
  label: string;
  style?: string;
  children?: TableColumn[];
}

export interface TableCell {
  key: string;
  value: string;
  classNames?: string;
}

export interface TableRow {
  cells: TableCell[];
  classNames?: string;
}

export interface FinancialSheetTemplateProps {
  organizationName: string;
  sheetName?: string;
  sheetDate?: string;
  table: {
    columns: TableColumn[];
    rows: TableRow[];
  };
  customCSS?: string;
}

interface TableHeaderCell {
  column: TableColumn;
  colSpan?: number;
  rowSpan?: number;
}

/**
 * Counts the columns that have no children, which are the ones a row has a
 * cell for.
 */
const countLeafColumns = (columns: TableColumn[]): number => {
  return columns.reduce(
    (count, column) =>
      count + (column.children?.length ? countLeafColumns(column.children) : 1),
    0,
  );
};

/**
 * Number of header rows the column tree needs.
 */
const getHeaderDepth = (columns: TableColumn[]): number => {
  return columns.reduce(
    (depth, column) =>
      Math.max(
        depth,
        column.children?.length ? 1 + getHeaderDepth(column.children) : 1,
      ),
    0,
  );
};

/**
 * Lays the column tree out as header rows. Parent columns span their children
 * on their own row, and leaf columns are placed on the last row, so every row
 * of cells keeps a matching header.
 */
const buildHeaderRows = (columns: TableColumn[]): TableHeaderCell[][] => {
  const depth = getHeaderDepth(columns);
  const rows: TableHeaderCell[][] = Array.from({ length: depth }, () => []);

  const walk = (nodes: TableColumn[], level: number): void => {
    nodes.forEach((column) => {
      if (column.children?.length) {
        rows[level].push({
          column,
          colSpan: countLeafColumns(column.children),
        });
        walk(column.children, level + 1);
      } else {
        const rowSpan = depth - level;
        rows[level].push({
          column,
          rowSpan: rowSpan > 1 ? rowSpan : undefined,
        });
      }
    });
  };
  walk(columns, 0);

  return rows;
};

export function FinancialSheetTemplate({
  organizationName,
  sheetName,
  sheetDate,
  table,
  customCSS,
}: FinancialSheetTemplateProps) {
  return (
    <Box fontSize="14px">
      <Box p="20px">
        <Box textAlign="center" mb="1rem">
          <Box m={0} fontSize="1.4rem">
            {organizationName}
          </Box>
          {sheetName && <Box m={0}>{sheetName}</Box>}
          {sheetDate && <Box mt="0.35rem">{sheetDate}</Box>}
        </Box>

        <x.table
          borderTop="1px solid #000"
          textAlign="left"
          fontSize="inherit"
          w="100%"
          tableLayout="auto"
          borderCollapse="collapse"
        >
          <x.thead>
            {buildHeaderRows(table.columns).map((headerRow, rowIndex) => (
              <x.tr key={rowIndex}>
                {headerRow.map(({ column, colSpan, rowSpan }, cellIndex) => (
                  <x.th
                    key={`${column.key}-${cellIndex}`}
                    {...(colSpan ? { colspan: colSpan } : {})}
                    {...(rowSpan ? { rowspan: rowSpan } : {})}
                    textAlign={colSpan ? "center" : undefined}
                    color="#000"
                    borderBottom="1px solid #000000"
                    p="0.5rem"
                    className={`column--${column.key}`}
                  >
                    {column.label}
                  </x.th>
                ))}
              </x.tr>
            ))}
          </x.thead>
          <x.tbody>
            {table.rows.map((row, rowIndex) => (
              <x.tr key={rowIndex} className={row.classNames}>
                {row.cells.map((cell) => (
                  <x.td
                    key={cell.key}
                    pt="0.28rem"
                    pb="0.28rem"
                    pl="0.5rem"
                    pr="0.5rem"
                    color="#252A31"
                    borderBottom="1px solid transparent"
                    className={
                      cell.classNames
                        ? `cell--${cell.key} ${cell.classNames}`
                        : `cell--${cell.key}`
                    }
                  >
                    <span dangerouslySetInnerHTML={{ __html: cell.value }} />
                  </x.td>
                ))}
              </x.tr>
            ))}
          </x.tbody>
        </x.table>

        {customCSS && (
          <x.style dangerouslySetInnerHTML={{ __html: customCSS }} />
        )}
      </Box>
    </Box>
  );
}
