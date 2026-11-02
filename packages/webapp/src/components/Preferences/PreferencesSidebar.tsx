// @ts-nocheck
import { Menu, MenuItem, MenuDivider } from '@blueprintjs/core';
import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import PreferencesSidebarContainer from './PreferencesSidebarContainer';
import { FormattedMessage as T } from '@/components';
import { PreferencesMenu } from '@/constants/preferencesMenu';
import { useExtensions } from '@/extensions/hooks/useExtensions';
import { extensionRegistry } from '@/extensions/registry';
import { useAbilityContext } from '@/hooks';
import { useFeatureCan } from '@/hooks/state/feature';

import '@/style/pages/Preferences/Sidebar.scss';

/**
 * Preferences sidebar.
 */
export default function PreferencesSidebar() {
  const history = useHistory();
  const location = useLocation();
  const { featureCan } = useFeatureCan();
  const ability = useAbilityContext();
  const { enabledIds } = useExtensions();

  const extensionMenuItems = extensionRegistry
    .getSettingsTabs(enabledIds)
    .map((tab) => ({
      id: `ext.${tab.extensionId}.${tab.id}`,
      text:
        typeof tab.label === 'string' ? (
          tab.label
        ) : (
          <T id={`ext.${tab.extensionId}.${tab.label.i18n}`} />
        ),
      href: tab.path,
      feature: tab.feature,
      permission: tab.permission
        ? {
            subject: tab.permission.subject,
            ability: tab.permission.action,
          }
        : undefined,
    }));

  const items = [...PreferencesMenu, ...extensionMenuItems]
    .filter((item) => {
      if (item.feature && !featureCan(item.feature)) {
        return false;
      }
      if (
        item.permission &&
        !ability.can(item.permission.ability, item.permission.subject)
      ) {
        return false;
      }
      return true;
    })
    .map((item) =>
      item.divider ? (
        <MenuDivider title={item.title} />
      ) : (
        <MenuItem
          active={item.href && item.href === location.pathname}
          text={item.text}
          label={item.label}
          disabled={item.disabled}
          onClick={() => {
            history.push(item.href);
          }}
        />
      ),
    );

  return (
    <PreferencesSidebarContainer>
      <div class="preferences-sidebar__head">
        <h2>{<T id={'preferences'} />}</h2>
      </div>

      <Menu className="preferences-sidebar__menu">{items}</Menu>
    </PreferencesSidebarContainer>
  );
}
