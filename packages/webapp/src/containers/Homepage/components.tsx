import { isEmpty } from 'lodash';
import type { HomepageSectionOption } from '@/constants/types';
import { useAbilityContext } from '@/hooks';

export const useFilterShortcutBoxesSection = (
  section: HomepageSectionOption[],
): HomepageSectionOption[] => {
  const ability = useAbilityContext();

  return section
    .map(({ sectionTitle, shortcuts }) => {
      const filteredShortcuts = shortcuts.filter((shortcut) => {
        return shortcut.ability != null && shortcut.subject != null
          ? ability.can(shortcut.ability, shortcut.subject)
          : false;
      });
      return {
        sectionTitle: sectionTitle,
        shortcuts: filteredShortcuts,
      };
    })
    .filter(({ shortcuts }) => !isEmpty(shortcuts));
};
