import React from 'react';
import { useAbilitiesFilter } from '../utils/useAbilityContext';
import { KeyboardShortcutsOptions } from '@/constants/keyboardShortcutsOptions';

/**
 * Retrieve the filtered keyword shortcuts.
 */
export const useKeywordShortcuts = () => {
  const abilitiesFilter = useAbilitiesFilter();

  return React.useMemo(
    () => abilitiesFilter(KeyboardShortcutsOptions),
    [abilitiesFilter],
  );
};
