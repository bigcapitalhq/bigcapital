import * as FF from 'fp-ts/function';
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

export const DashboardUniversalSearchHotkeys = FF.pipe(
  DashboardUniversalSearchHotkey,
  withUniversalSearchActions,
);
