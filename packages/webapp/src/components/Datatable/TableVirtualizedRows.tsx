import React, { useContext } from 'react';
import { WindowScroller, AutoSizer, List } from 'react-virtualized';
import TableContext from './TableContext';
import type { ListRowRendererParams } from 'react-virtualized';
import { CLASSES } from '@/constants/classes';

interface TableVirtualizedListRowProps {
  index: number;
  isScrolling?: boolean;
  isVisible?: boolean;
  style?: React.CSSProperties;
}

function TableVirtualizedListRow({
  index,
  style,
}: TableVirtualizedListRowProps) {
  const {
    table: { page, prepareRow },
    props: { TableRowRenderer },
  } = useContext(TableContext);

  const row = page[index];
  prepareRow(row);

  return <TableRowRenderer row={row} style={style} />;
}

export function TableVirtualizedListRows() {
  const {
    table: { page },
    props: { vListrowHeight = 0, vListOverscanRowCount, windowScrollerProps },
  } = useContext(TableContext);

  const scrollElement =
    windowScrollerProps?.scrollElement ||
    document.querySelector(`.${CLASSES.DASHBOARD_CONTENT_PANE}`);

  const rowRenderer = React.useCallback(
    ({ key, ...args }: ListRowRendererParams) => (
      <TableVirtualizedListRow {...args} key={key} />
    ),
    [],
  );

  return (
    <WindowScroller scrollElement={scrollElement as HTMLElement}>
      {({ height, isScrolling, onChildScroll, scrollTop }) => (
        <AutoSizer disableHeight>
          {({ width }) => (
            <List
              autoHeight={true}
              className={'List'}
              height={height}
              isScrolling={isScrolling}
              onScroll={onChildScroll}
              overscanRowCount={vListOverscanRowCount}
              rowCount={page.length}
              rowHeight={vListrowHeight}
              rowRenderer={rowRenderer}
              scrollTop={scrollTop}
              width={width}
            />
          )}
        </AutoSizer>
      )}
    </WindowScroller>
  );
}
