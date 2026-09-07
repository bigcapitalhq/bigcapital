// @ts-nocheck
import * as FF from 'fp-ts/function';
import { useHotkeys } from 'react-hotkeys-hook';
import { withUniversalSearchActions } from './withUniversalSearchActions';

/**
 * Universal search hotkey.
 */
function DashboardUniversalSearchHotkey({ openGlobalSearch }) {
  useHotkeys('shift+p', (event, handle) => {
    openGlobalSearch();
  });

  return null;
}

export const DashboardUniversalSearchHotkeys = FF.pipe(
  DashboardUniversalSearchHotkey,
  withUniversalSearchActions,
);
