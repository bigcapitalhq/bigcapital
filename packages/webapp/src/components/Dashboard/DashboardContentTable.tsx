import classNames from 'classnames';
import React, { useEffect, useRef } from 'react';
import { CLASSES, NS } from '@/constants/classes';

interface DashboardContentTableProps {
  children?: React.ReactNode;
}

/**
 * Dashboard content table.
 */
export function DashboardContentTable({
  children,
}: DashboardContentTableProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Chromium can send copy to the body when the grid owns focus but has no DOM text selection.
    const handleCopy = (event: ClipboardEvent) => {
      const grid = document.activeElement;
      if (
        event.defaultPrevented ||
        event.target !== document.body ||
        !event.clipboardData ||
        !grid?.classList.contains(`${NS}-table-quadrant-scroll-container`) ||
        !containerRef.current?.contains(grid)
      ) {
        return;
      }

      const gridCopy = new ClipboardEvent('copy', {
        bubbles: true,
        cancelable: true,
        clipboardData: event.clipboardData,
      });
      if (!grid.dispatchEvent(gridCopy)) event.preventDefault();
    };

    document.addEventListener('copy', handleCopy);
    return () => document.removeEventListener('copy', handleCopy);
  }, []);

  return (
    <div ref={containerRef} className={classNames(CLASSES.DASHBOARD_DATATABLE)}>
      {children}
    </div>
  );
}
