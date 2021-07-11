import React from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useHistory } from 'react-router-dom';
import { getDashboardRoutes } from 'routes/dashboard';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import { compose } from 'utils';

function GlobalHotkeys({
  // #withDashboardActions
  toggleSidebarExpend,
}) {
  const history = useHistory();
  const routes = getDashboardRoutes();

  const globalHotkeys = routes
    .filter(({ hotkey }) => hotkey)
    .map(({ hotkey }) => hotkey)
    .toString();
  
    const handleSidebarToggleBtn = () => {
    toggleSidebarExpend();
  };
  useHotkeys(
    globalHotkeys,
    (event, handle) => {
      routes.map(({ path, hotkey }) => {
        if (handle.key === hotkey) {
          history.push(path);
        }
      });
    },
    [history],
  );
  useHotkeys('ctrl+/', (event, handle) => handleSidebarToggleBtn());
  return <div></div>;
}

export default compose(withDashboardActions)(GlobalHotkeys);
