import { debounce } from 'lodash';
import React, { useState, useRef } from 'react';
import SplitPane from 'react-split-pane';
import { withDashboard } from '@/containers/Dashboard/withDashboard';
import { compose } from '@/utils';

interface DashboardSplitPaneProps {
  sidebarExpended: boolean;
  children?: React.ReactNode;
}

interface SplitPaneWithChildrenProps {
  allowResize?: boolean;
  split?: 'vertical' | 'horizontal';
  minSize?: number | string;
  maxSize?: number | string;
  defaultSize?: number | string;
  size?: number | string;
  onChange?: (size: number) => void;
  className?: string;
  children?: React.ReactNode;
}

const SplitPaneComponent =
  SplitPane as unknown as React.ComponentType<SplitPaneWithChildrenProps>;

function DashboardSplitPane({
  sidebarExpended,
  children,
}: DashboardSplitPaneProps) {
  const initialSize = 220;

  const [defaultSize, setDefaultSize] = useState(
    parseInt(localStorage.getItem('dashboard-size') || '', 10) || initialSize,
  );
  const debounceSaveSize = useRef(
    debounce((size: number) => {
      localStorage.setItem('dashboard-size', String(size));
    }, 500),
  );
  const handleChange = (size: number) => {
    debounceSaveSize.current(size);
    setDefaultSize(size);
  };
  return (
    <SplitPaneComponent
      allowResize={sidebarExpended}
      split="vertical"
      minSize={180}
      maxSize={300}
      defaultSize={sidebarExpended ? defaultSize : 50}
      size={sidebarExpended ? defaultSize : 50}
      onChange={handleChange}
      className="primary"
    >
      {children}
    </SplitPaneComponent>
  );
}

export default compose(
  withDashboard(({ sidebarExpended }) => ({ sidebarExpended })),
)(DashboardSplitPane);
