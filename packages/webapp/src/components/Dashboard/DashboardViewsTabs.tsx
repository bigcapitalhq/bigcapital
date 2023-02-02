// @ts-nocheck
import React, { useRef, useState, useEffect } from 'react';
import { FormattedMessage as T } from '@/components';
import PropTypes from 'prop-types';
import { Button, Tabs, Tab, Tooltip, Position } from '@blueprintjs/core';
import { useHistory } from 'react-router';
import { debounce } from 'lodash';
import { If, Icon } from '@/components';
import { saveInvoke } from '@/utils';

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
}) {
  const history = useHistory();
  const [currentView, setCurrentView] = useState(initialViewSlug || 0);

  useEffect(() => {
    if (
      typeof currentViewSlug !== 'undefined' &&
      currentViewSlug !== currentView
    ) {
      setCurrentView(currentViewSlug || 0);
    }
  }, [currentView, setCurrentView, currentViewSlug]);

  const throttledOnChange = useRef(
    debounce((viewId) => saveInvoke(OnThrottledChange, viewId), throttleTime),
  );

  // Trigger `onChange` and `onThrottledChange` events.
  const triggerOnChange = (viewSlug) => {
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
  const handleTabsChange = (viewSlug) => {
    setCurrentView(viewSlug);
    triggerOnChange(viewSlug);
  };

  return (
    <div class="dashboard__views-tabs">
      <Tabs
        id="navbar"
        large={true}
        selectedTabId={currentView}
        className="tabs--dashboard-views"
        onChange={handleTabsChange}
        animate={false}
      >
        {allTab && <Tab id={0} title={defaultTabText} />}

        {tabs.map((tab) => (
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

DashboardViewsTabs.propTypes = {
  tabs: PropTypes.array.isRequired,
  allTab: PropTypes.bool,
  newViewTab: PropTypes.bool,

  onNewViewTabClick: PropTypes.func,
  onChange: PropTypes.func,
  OnThrottledChange: PropTypes.func,
  throttleTime: PropTypes.number,
};
