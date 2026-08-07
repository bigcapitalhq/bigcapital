import classNames from 'classnames';
import React, { useCallback, useContext } from 'react';
import useContextMenu from 'react-use-context-menu';
import TableContext from './TableContext';
import type { Row } from 'react-table';
import { ContextMenu } from '@/components';
import { saveInvoke, ConditionalWrapper } from '@/utils';

interface TableRowContextMenuProps {
  children?: React.ReactNode;
  row: Row<any>;
}

function TableRowContextMenu({ children, row }: TableRowContextMenuProps) {
  const {
    props: { ContextMenu: ContextMenuContent },
    table,
  } = useContext(TableContext);

  if (!ContextMenuContent) {
    return <>{children}</>;
  }

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
    <div className="tr-context" {...bindTrigger}>
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

interface TableRowProps {
  row: Row<any>;
  className?: string;
  style?: React.CSSProperties;
  TableCellRenderer?: React.ComponentType<any>;
}

export default function TableRow({ row, className, style }: TableRowProps) {
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
