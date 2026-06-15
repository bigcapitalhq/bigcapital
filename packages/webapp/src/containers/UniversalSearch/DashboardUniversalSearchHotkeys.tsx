// @ts-nocheck
import * as R from 'ramda';
import { useHotkeys } from 'react-hotkeys-hook';
import { withUniversalSearchActions } from './withUniversalSearchActions';
import { flow } from 'fp-ts/function';

/**
 * Universal search hotkey.
 */
function DashboardUniversalSearchHotkey({ openGlobalSearch }) {
  useHotkeys('shift+p', (event, handle) => {
    openGlobalSearch();
  });

  return null;
}

export const DashboardUniversalSearchHotkeys = flow(
  withUniversalSearchActions,
)(DashboardUniversalSearchHotkey);
