import React from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useHistory } from 'react-router-dom';
import routes from 'routes/dashboard';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import { compose } from 'utils';


function GlobalHotkeys({
  // #withDashboardActions
  toggleSidebarExpend,
  recordSidebarPreviousExpand,
}) {
  const history = useHistory();

  const globalHotkeys = (function (array) {
    const result = [];
    array.forEach(({ hotkey }) =>
      typeof hotkey !== 'undefined' ? result.push(hotkey) : null,
    );
    return result.toString();
  })(routes);

  const handleSidebarToggleBtn = () => {
    toggleSidebarExpend();
    recordSidebarPreviousExpand();
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
