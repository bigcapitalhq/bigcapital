import * as R from 'ramda';
import { useHotkeys } from 'react-hotkeys-hook';
import { withUniversalSearchActions } from './withUniversalSearchActions';
import type { WithUniversalSearchActionsProps } from './withUniversalSearchActions';

/**
 * Universal search hotkey.
 */
function DashboardUniversalSearchHotkey({
  openGlobalSearch,
}: WithUniversalSearchActionsProps) {
  useHotkeys('shift+p', () => {
    openGlobalSearch();
  });

  return null;
}

export const DashboardUniversalSearchHotkeys = R.compose(
  withUniversalSearchActions,
)(DashboardUniversalSearchHotkey);
