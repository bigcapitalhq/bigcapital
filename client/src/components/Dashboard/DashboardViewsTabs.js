import React, { useRef, useState, useEffect } from 'react';
import { FormattedMessage as T } from 'react-intl';
import PropTypes from 'prop-types';
import { Button, Tabs, Tab, Tooltip, Position } from '@blueprintjs/core';
import { useHistory } from 'react-router';
import { debounce } from 'lodash';
import { If, Icon } from 'components';
import { saveInvoke } from 'utils';

/**
 * Dashboard views tabs.
 *
 */
export default function DashboardViewsTabs({
  initialViewId = 0,
  currentViewId,
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
  const [currentView, setCurrentView] = useState(initialViewId || 0);

  useEffect(() => {
    if (typeof currentViewId !== 'undefined' && currentViewId !== currentView) {
      setCurrentView(currentViewId || 0);
    }
  }, [currentView, setCurrentView, currentViewId]);

  const throttledOnChange = useRef(
    debounce((viewId) => saveInvoke(OnThrottledChange, viewId), throttleTime),
  );

  // Trigger `onChange` and `onThrottledChange` events.
  const triggerOnChange = (viewId) => {
    saveInvoke(onChange, viewId);
    throttledOnChange.current(viewId);
  };

  // Handles click a new view.
  const handleClickNewView = () => {
    history.push(`/custom_views/${resourceName}/new`);
    onNewViewTabClick && onNewViewTabClick();
  };

  // Handle tabs change.
  const handleTabsChange = (viewId) => {
    setCurrentView(viewId);
    triggerOnChange(viewId)
  };

  return (
    <Tabs
      id="navbar"
      large={true}
      selectedTabId={currentView}
      className="tabs--dashboard-views"
      onChange={handleTabsChange}
    >
      {allTab && <Tab id={0} title={defaultTabText} />}

      {tabs.map((tab) => (
        <Tab id={tab.id} title={tab.name} />
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
