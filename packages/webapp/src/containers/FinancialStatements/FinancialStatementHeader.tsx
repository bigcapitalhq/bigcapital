// @ts-nocheck
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { Position, Drawer } from '@blueprintjs/core';
import '@/style/containers/FinancialStatements/DrawerHeader.scss';

/**
 * Financial statement header.
 * @returns {JSX.Element}
 */
export default function FinancialStatementHeader({
  children,
  isOpen,
  drawerProps,
  className,
}) {
  const timeoutRef = React.useRef();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Hides the content scrollbar and scroll to the top of the page once the drawer open.
  useEffect(() => {
    const contentPanel = document.querySelector('body');
    contentPanel.classList.toggle('hide-scrollbar', isOpen);

    if (isOpen) {
      document.querySelector('.Pane2').scrollTo(0, 0);
    }
    return () => {
      contentPanel.classList.remove('hide-scrollbar');
    };
  }, [isOpen]);

  useEffect(() => {
    clearTimeout(timeoutRef.current);

    if (isOpen) {
      setIsDrawerOpen(isOpen);
    } else {
      timeoutRef.current = setTimeout(() => setIsDrawerOpen(isOpen), 300);
    }
  }, [isOpen]);

  return (
    <div
      className={classNames(
        'financial-statement__header',
        'financial-header-drawer',
        {
          'is-hidden': !isDrawerOpen,
        },
        className,
      )}
    >
      <Drawer
        isOpen={isOpen}
        usePortal={false}
        hasBackdrop={true}
        position={Position.TOP}
        canOutsideClickClose={true}
        canEscapeKeyClose={true}
        {...drawerProps}
      >
        {children}
      </Drawer>
    </div>
  );
}
