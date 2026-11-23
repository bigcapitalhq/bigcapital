import * as FF from 'fp-ts/function';
import React from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useHistory } from 'react-router-dom';
import type { WithDashboardActionsProps } from '@/containers/Dashboard/withDashboardActions';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import type { WithUniversalSearchActionsProps } from '@/containers/UniversalSearch/withUniversalSearchActions';
import { NS } from '@/constants/classes';
import { withDashboardActions } from '@/containers/Dashboard/withDashboardActions';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { withUniversalSearchActions } from '@/containers/UniversalSearch/withUniversalSearchActions';
import { getDashboardRoutes } from '@/routes/dashboard';

interface GlobalHotkeyRoute {
  path: string;
  hotkey?: string;
}

const handleToggleDarkMode = () => {
  const dark = !document.body.classList.contains(`${NS}-dark`);
  document.documentElement.classList.toggle(`${NS}-dark`, dark);
  document.body.classList.toggle(`${NS}-dark`, dark);
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

export default FF.pipe(
  GlobalHotkeys,
  withUniversalSearchActions,
  withDialogActions,
  withDashboardActions,
);
