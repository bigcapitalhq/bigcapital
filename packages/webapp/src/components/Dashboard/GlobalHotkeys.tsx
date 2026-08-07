import React from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useHistory } from 'react-router-dom';
import type { WithDashboardActionsProps } from '@/containers/Dashboard/withDashboardActions';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import type { WithUniversalSearchActionsProps } from '@/containers/UniversalSearch/withUniversalSearchActions';
import { withDashboardActions } from '@/containers/Dashboard/withDashboardActions';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { withUniversalSearchActions } from '@/containers/UniversalSearch/withUniversalSearchActions';
import { getDashboardRoutes } from '@/routes/dashboard';
import { compose } from '@/utils';

interface GlobalHotkeyRoute {
  path: string;
  hotkey?: string;
}

// Toggle dark/light mode by toggling 'bp4-dark' class on body
const handleToggleDarkMode = () => {
  const body = document.body;

  if (body.classList.contains('bp4-dark')) {
    body.classList.remove('bp4-dark');
  } else {
    body.classList.add('bp4-dark');
  }
};

type GlobalHotkeysProps = Pick<
  WithDashboardActionsProps,
  'toggleSidebarExpand'
> &
  Pick<WithUniversalSearchActionsProps, 'openGlobalSearch'> &
  Pick<WithDialogActionsProps, 'openDialog'>;

function GlobalHotkeys({
  // #withDashboardActions
  toggleSidebarExpand,

  // withUniversalSearchActions
  openGlobalSearch,

  // #withDialogActions
  openDialog,
}: GlobalHotkeysProps) {
  const history = useHistory();
  const routes = getDashboardRoutes() as GlobalHotkeyRoute[];

  const globalHotkeys = routes
    .filter(({ hotkey }) => hotkey)
    .map(({ hotkey }) => hotkey)
    .toString();

  const handleSidebarToggleBtn = () => {
    toggleSidebarExpand();
  };
  useHotkeys(
    globalHotkeys,
    (_event, handle) => {
      routes.map(({ path, hotkey }) => {
        if (handle.key === hotkey) {
          history.push(path);
        }
      });
    },
    [history],
  );
  useHotkeys('ctrl+/', () => {
    handleSidebarToggleBtn();
  });
  useHotkeys('shift+d', () => {
    openDialog('money-in', {});
  });
  useHotkeys('shift+q', () => {
    openDialog('money-out', {});
  });
  useHotkeys('/', () => {
    setTimeout(() => {
      openGlobalSearch();
    }, 0);
  });
  useHotkeys('shift+h', () => {
    handleToggleDarkMode();
  });

  return <div></div>;
}

export default compose(
  withDashboardActions,
  withDialogActions,
  withUniversalSearchActions,
)(GlobalHotkeys);
