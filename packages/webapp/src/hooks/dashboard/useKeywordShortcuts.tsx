// @ts-nocheck
import React from 'react';
import { KeyboardShortcutsOptions } from '@/constants/keyboardShortcutsOptions';
import { useAbilitiesFilter } from '../utils/useAbilityContext';

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
