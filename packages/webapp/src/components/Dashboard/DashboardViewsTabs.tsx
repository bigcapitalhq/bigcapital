import { Button, Tabs, Tab, Tooltip, Position } from '@blueprintjs/core';
import { debounce } from 'lodash';
import React, { useRef, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { FormattedMessage as T } from '@/components';
import { If, Icon } from '@/components';
import { saveInvoke } from '@/utils';

interface DashboardViewsTabsProps {
  initialViewSlug?: any;
  currentViewSlug?: any;
  tabs: any[];
  defaultTabText?: React.ReactNode;
  allTab?: boolean;
  newViewTab?: boolean;
  resourceName?: string;
  onNewViewTabClick?: () => void;
  onChange?: (value: any) => void;
  OnThrottledChange?: (value: any) => void;
  throttleTime?: number;
}

/**
 * Dashboard views tabs.
 */
export function DashboardViewsTabs({
  initialViewSlug = 0,
  currentViewSlug,
  tabs,
  defaultTabText = <T id={'all'} />,
  allTab = true,
  newViewTab = true,
  resourceName,
  onNewViewTabClick,
  onChange,
  OnThrottledChange,
  throttleTime = 250,
}: DashboardViewsTabsProps) {
  const history = useHistory();
  const [currentView, setCurrentView] = useState<string | number>(
    initialViewSlug || 0,
  );

  useEffect(() => {
    if (
      typeof currentViewSlug !== 'undefined' &&
      currentViewSlug !== currentView
    ) {
      setCurrentView(currentViewSlug || 0);
    }
  }, [currentView, setCurrentView, currentViewSlug]);

  const throttledOnChange = useRef(
    debounce(
      (viewId: any) => saveInvoke(OnThrottledChange, viewId),
      throttleTime,
    ),
  );

  // Trigger `onChange` and `onThrottledChange` events.
  const triggerOnChange = (viewSlug: string | number) => {
    const value = viewSlug === 0 ? null : viewSlug;
    saveInvoke(onChange, value);
    throttledOnChange.current(value);
  };

  // Handles click a new view.
  const handleClickNewView = () => {
    history.push(`/custom_views/${resourceName}/new`);
    onNewViewTabClick && onNewViewTabClick();
  };

  // Handle tabs change.
  const handleTabsChange = (viewSlug: string | number) => {
    setCurrentView(viewSlug);
    triggerOnChange(viewSlug);
  };

  return (
    <div className="dashboard__views-tabs">
      <Tabs
        id="navbar"
        large={true}
        selectedTabId={currentView}
        className="tabs--dashboard-views"
        onChange={handleTabsChange}
        animate={false}
      >
        {allTab && <Tab id={0} title={defaultTabText} />}

        {(
          tabs as Array<{ slug?: string | number; name?: React.ReactNode }>
        ).map((tab) => (
          <Tab id={tab.slug} title={tab.name} />
        ))}
        <If condition={newViewTab}>
          <Tooltip
            content={<T id={'create_a_new_view'} />}
            position={Position.RIGHT}
          >
            <Button
              className="button--new-view"
              icon={<Icon icon="plus" />}
              onClick={handleClickNewView}
              minimal={true}
            />
          </Tooltip>
        </If>
      </Tabs>
    </div>
  );
}
