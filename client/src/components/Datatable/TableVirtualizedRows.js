import React, { useContext } from 'react';
import { WindowScroller, AutoSizer, List } from 'react-virtualized';
import { CLASSES } from 'common/classes';
import TableContext from './TableContext';

function TableVirtualizedListRow({
  index,
  isScrolling,
  isVisible,
  key,
  style,
}) {
  const {
    table: { page, prepareRow },
    props: { TableRowRenderer },
  } = useContext(TableContext);

  const row = page[index];
  prepareRow(row);

  return <TableRowRenderer row={row} style={style} />;
}

/**
 * Table virtualized list rows.
 */
export default function TableVirtualizedListRows() {
  const {
    table: { page },
    props: { vListrowHeight, vListOverscanRowCount }
  } = useContext(TableContext);

  // Dashboard content pane.
  const dashboardContentPane = document.querySelector(
    `.${CLASSES.DASHBOARD_CONTENT_PANE}`,
  );
  return (
    <WindowScroller scrollElement={dashboardContentPane}>
      {({ height, isScrolling, registerChild, onChildScroll, scrollTop }) => (
        <div className={'WindowScrollerWrapper'}>
          <AutoSizer disableHeight>
            {({ width }) => (
              <div ref={registerChild}>
                <List
                  autoHeight={true}
                  className={'List'}
                  height={height}
                  isScrolling={isScrolling}
                  onScroll={onChildScroll}
                  overscanRowCount={vListOverscanRowCount}
                  rowCount={page.length}
                  rowHeight={vListrowHeight}
                  rowRenderer={({ ...args }) => {
                    return <TableVirtualizedListRow {...args} />;
                  }}
                  scrollTop={scrollTop}
                  width={width}
                />
              </div>
            )}
          </AutoSizer>
        </div>
      )}
    </WindowScroller>
  );
}
