// @ts-nocheck
import * as R from 'ramda';
import { useHotkeys } from 'react-hotkeys-hook';

import withUniversalSearchActions from './withUniversalSearchActions';

/**
 * Universal search hotkey.
 */
function DashboardUniversalSearchHotkey({
  openGlobalSearch,
}) {
  useHotkeys('shift+p', (event, handle) => {
    openGlobalSearch();
  });

  return null;
}

export default R.compose(
  withUniversalSearchActions
)(DashboardUniversalSearchHotkey);
