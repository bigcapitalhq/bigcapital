import React, { useState, useMemo } from 'react';
import { FormattedMessage as T } from 'react-intl';
import PropTypes from 'prop-types';
import { Button, Tabs, Tab, Tooltip, Position } from '@blueprintjs/core';
import { If, Icon } from 'components';

export default function DashboardViewsTabs({
  tabs,
  allTab = true,
  newViewTab = true,
  onNewViewTabClick,
  onChange,
  onTabClick,
}) {
  const [currentView, setCurrentView] = useState(0);

  const handleClickNewView = () => {
    onNewViewTabClick && onNewViewTabClick();
  };

  const handleTabClick = (viewId) => {
    onTabClick && onTabClick(viewId);
  };

  const mappedTabs = useMemo(
    () => tabs.map((tab) => ({ ...tab, onTabClick: handleTabClick })),
    [tabs],
  );

  const handleViewLinkClick = () => {
    onNewViewTabClick && onNewViewTabClick();
  };

  const handleTabsChange = (viewId) => {
    setCurrentView(viewId);
    onChange && onChange(viewId);
  };

  return (
    <Tabs
      id="navbar"
      large={true}
      selectedTabId={currentView}
      className="tabs--dashboard-views"
      onChange={handleTabsChange}
    >
      {allTab && (
        <Tab id={0} title={<T id={'all'} />} onClick={handleViewLinkClick} />
      )}
      {mappedTabs.map((tab) => (
        <Tab id={tab.id} title={tab.name} onClick={handleTabClick} />
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
  onTabClick: PropTypes.func,
};
