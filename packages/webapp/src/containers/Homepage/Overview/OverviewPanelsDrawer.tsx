import {
  Button,
  Classes,
  Drawer,
  Intent,
  Position,
  Switch,
} from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import styles from './Overview.module.scss';
import type { OverviewPanelId, OverviewPanelPref } from './overviewPanels';

export const PANEL_TITLE_KEYS: Record<OverviewPanelId, string> = {
  cash: 'homepage.overview.cash',
  'net-income': 'homepage.overview.net_income_ytd',
  revenue: 'homepage.overview.revenue',
  spend: 'homepage.overview.spend',
  owed: 'homepage.overview.owed_to_you',
  bills: 'homepage.overview.bills_to_pay',
  'top-expenses': 'homepage.overview.top_expenses_ytd',
};

const PANEL_DESCRIPTION_KEYS: Record<OverviewPanelId, string> = {
  cash: 'homepage.overview.panel_cash_desc',
  'net-income': 'homepage.overview.panel_net_income_desc',
  revenue: 'homepage.overview.panel_revenue_desc',
  spend: 'homepage.overview.panel_spend_desc',
  owed: 'homepage.overview.panel_owed_desc',
  bills: 'homepage.overview.panel_bills_desc',
  'top-expenses': 'homepage.overview.panel_top_expenses_desc',
};

interface OverviewPanelsDrawerProps {
  isOpen: boolean;
  panels: OverviewPanelPref[];
  onClose: () => void;
  onMove: (index: number, direction: -1 | 1) => void;
  onToggle: (id: OverviewPanelId) => void;
  onReset: () => void;
}

/** Show, hide and reorder the overview panels (buttons, no drag). */
export function OverviewPanelsDrawer({
  isOpen,
  panels,
  onClose,
  onMove,
  onToggle,
  onReset,
}: OverviewPanelsDrawerProps) {
  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      position={Position.RIGHT}
      size={420}
      title={intl.get('homepage.overview.panels')}
    >
      <div
        className={`${Classes.DRAWER_BODY} ${styles.drawerBody}`}
        data-testId="overview-panels-drawer"
      >
        {panels.map((panel, index) => {
          const name = intl.get(PANEL_TITLE_KEYS[panel.id]);
          return (
            <div key={panel.id} className={styles.panelRow}>
              <div>
                {name}
                <small>{intl.get(PANEL_DESCRIPTION_KEYS[panel.id])}</small>
              </div>
              <Button
                small
                icon="arrow-up"
                disabled={index === 0}
                aria-label={intl.get('homepage.overview.move_up', { name })}
                onClick={() => onMove(index, -1)}
              />
              <Button
                small
                icon="arrow-down"
                disabled={index === panels.length - 1}
                aria-label={intl.get('homepage.overview.move_down', { name })}
                onClick={() => onMove(index, 1)}
              />
              <Switch
                checked={panel.visible}
                aria-label={intl.get('homepage.overview.show_panel', { name })}
                onChange={() => onToggle(panel.id)}
              />
            </div>
          );
        })}
      </div>
      <div className={`${Classes.DRAWER_FOOTER} ${styles.drawerFooter}`}>
        <Button onClick={onReset}>{intl.get('homepage.overview.reset')}</Button>
        <Button intent={Intent.PRIMARY} onClick={onClose}>
          {intl.get('homepage.overview.done')}
        </Button>
      </div>
    </Drawer>
  );
}
