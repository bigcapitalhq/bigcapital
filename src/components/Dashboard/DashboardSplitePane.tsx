// @ts-nocheck
import React, { useState, useRef } from 'react';
import SplitPane from 'react-split-pane';
import { debounce } from 'lodash';

import withDashboard from '@/containers/Dashboard/withDashboard';
import { compose } from '@/utils';

function DashboardSplitPane({
  sidebarExpended,
  children
}) {
  const initialSize = 220;

  const [defaultSize, setDefaultSize] = useState(
    parseInt(localStorage.getItem('dashboard-size'), 10) || initialSize,
  );
  const debounceSaveSize = useRef(
    debounce((size) => {
      localStorage.setItem('dashboard-size', size);
    }, 500),
  );
  const handleChange = (size) => {
    debounceSaveSize.current(size);
    setDefaultSize(size);
  }
  return (
    <SplitPane
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
    </SplitPane>
  );
}

export default compose(
  withDashboard(({ sidebarExpended }) => ({ sidebarExpended }))
)(DashboardSplitPane);