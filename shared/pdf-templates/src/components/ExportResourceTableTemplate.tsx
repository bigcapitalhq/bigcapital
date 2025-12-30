import React from 'react';
import { x } from '@xstyled/emotion';
import { Box } from '../lib/layout/Box';

export interface ExportResourceTableColumn {
  accessor: string;
  name?: string;
  style?: string;
  group?: string;
}

export interface ExportResourceTableCell {
  key: string;
  value: string;
}

export interface ExportResourceTableRow {
  cells: ExportResourceTableCell[];
  classNames?: string;
}

export interface ExportResourceTableTemplateProps {
  sheetTitle?: string;
  sheetDescription?: string;
  table: {
    columns: ExportResourceTableColumn[];
    rows: ExportResourceTableRow[];
  };
  customCSS?: string;
}

export function ExportResourceTableTemplate({
  sheetTitle,
  sheetDescription,
  table,
  customCSS,
}: ExportResourceTableTemplateProps) {
  return (
    <Box fontSize="12px" lineHeight="1.4" fontFamily='system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue","Noto Sans","Liberation Sans",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"'>
      <Box p="20px">
        {(sheetTitle || sheetDescription) && (
          <Box mb="18px" className="sheet__title">
            {sheetTitle && (
              <x.h2 m={0} mb="10px" fontSize="16px" lineHeight="1" className="sheetTitle">
                {sheetTitle}
              </x.h2>
            )}
            {sheetDescription && (
              <x.p m={0} className="sheetDesc">
                {sheetDescription}
              </x.p>
            )}
          </Box>
        )}

        <x.table
          className="sheet__table"
          fontSize="inherit"
          lineHeight="inherit"
          w="100%"
          tableLayout="auto"
          borderCollapse="collapse"
        >
          <x.thead>
            <x.tr>
              {table.columns.map((column) => {
                let styleObj: React.CSSProperties | undefined;
                if (column.style) {
                  try {
                    // Handle style as JSON string
                    styleObj = JSON.parse(column.style);
                  } catch {
                    // If parsing fails, ignore the style
                    styleObj = undefined;
                  }
                }
                return (
                  <x.th
                    key={column.accessor}
                    borderTop="1px solid #000"
                    borderBottom="1px solid #000"
                    bg="#fff"
                    p="4px"
                    lineHeight="1.2"
                    className={`column--${column.accessor}`}
                    style={styleObj}
                  >
                    {column.name || column.accessor}
                  </x.th>
                );
              })}
            </x.tr>
          </x.thead>
          <x.tbody>
            {table.rows.map((row, rowIndex) => (
              <x.tr key={rowIndex} className={row.classNames}>
                {row.cells.map((cell) => (
                  <x.td
                    key={cell.key}
                    p="4px 8px"
                    borderBottom="1px solid #CCC"
                    className={`cell--${cell.key}`}
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

