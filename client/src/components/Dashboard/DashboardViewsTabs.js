import React, { useState, useRef, useMemo } from 'react';
import { FormattedMessage as T } from 'react-intl';
import PropTypes from 'prop-types';
import { Button, Tabs, Tab, Tooltip, Position } from '@blueprintjs/core';
import { debounce } from 'lodash';
import { useHistory } from 'react-router';
import { If, Icon } from 'components';

export default function DashboardViewsTabs({
  initialViewId = 0,
  tabs,
  allTab = true,
  newViewTab = true,
  resourceName,
  onNewViewTabClick,
  onChange,
  onTabClick,
}) {
  const history = useHistory();
  const [currentView, setCurrentView] = useState(initialViewId || 0);

  const handleClickNewView = () => {
    history.push(`/custom_views/${resourceName}/new`);
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

  const debounceChangeHistory = useRef(
    debounce((toUrl) => {
      history.push(toUrl);
    }, 250),
  );

  const handleTabsChange = (viewId) => {
    const toPath = viewId ? `${viewId}/custom_view` : '';
    debounceChangeHistory.current(`/${resourceName}/${toPath}`);

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
