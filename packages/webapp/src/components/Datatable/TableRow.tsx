// @ts-nocheck
import React, { useCallback, useContext } from 'react';
import { ContextMenu } from '@/components';
import classNames from 'classnames';
import useContextMenu from 'react-use-context-menu';

import TableContext from './TableContext';
import { saveInvoke, ConditionalWrapper } from '@/utils';

/**
 * Table row context wrapper.
 */
function TableRowContextMenu({ children, row }) {
  // Table context.
  const {
    props: { ContextMenu: ContextMenuContent },
    table,
  } = useContext(TableContext);

  const [
    bindMenu,
    bindMenuItem,
    useContextTrigger,
    { coords, setVisible, isVisible },
  ] = useContextMenu();

  const [bindTrigger] = useContextTrigger({
    collect: () => 'Title',
  });

  const handleClose = useCallback(() => {
    setVisible(false);
  }, [setVisible]);

  return (
    <div class="tr-context" {...bindTrigger}>
      {children}

      <ContextMenu
        bindMenu={bindMenu}
        isOpen={isVisible}
        coords={coords}
        onClosed={handleClose}
      >
        <ContextMenuContent {...table} row={row} />
      </ContextMenu>
    </div>
  );
}

/**
 * Table row.
 */
export default function TableRow({ row, className, style }) {
  const {
    props: {
      TableCellRenderer,
      rowClassNames,
      ContextMenu: ContextMenuContent,
    },
  } = useContext(TableContext);

  return (
    <div
      {...row.getRowProps({
        className: classNames(
          'tr',
          { 'is-expanded': row.isExpanded && row.canExpand },
          saveInvoke(rowClassNames, row),
          className,
        ),
        style,
      })}
    >
      <ConditionalWrapper
        condition={ContextMenuContent}
        wrapper={TableRowContextMenu}
        row={row}
      >
        {row.cells.map((cell, index) => (
          <TableCellRenderer
            key={index}
            cell={cell}
            row={row}
            index={index + 1}
          />
        ))}
      </ConditionalWrapper>
    </div>
  );
}
