import React from 'react';
import keyboardShortcuts from 'common/keyboardShortcutsOptions';
import { useAbilitiesFilter } from '../utils/useAbilityContext';

/**
 * Retrieve the filtered keyword shortcuts.
 */
export const useKeywordShortcuts = () => {
  const abilitiesFilter = useAbilitiesFilter();

  return React.useMemo(
    () => abilitiesFilter(keyboardShortcuts),
    [abilitiesFilter],
  );
};
