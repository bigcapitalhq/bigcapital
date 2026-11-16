import { Button, Intent } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import { useHistory } from 'react-router-dom';
import styles from './Overview.module.scss';
import { BANK_ACCOUNTS_LINK, NEW_INVOICE_LINK } from './overviewLinks';
import { OverviewStatement } from './OverviewStatement';
import { OverviewStatus } from './OverviewStatus';
import { OverviewStrip } from './OverviewStrip';
import { OverviewTiles } from './OverviewTiles';
import { useOverviewData } from './useOverviewData';
import type { OverviewPanelPref } from './overviewPanels';
import type { OverviewData } from './useOverviewData';

/**
 * A brand-new organization has no activity anywhere, so a page of zeros
 * would say nothing. Only decided once every visible source has answered.
 */
function isNewOrganization(data: OverviewData): boolean {
  const sources = [data.profitLoss, data.cash, data.receivable, data.payable];
  if (sources.some((s) => s.status === 'loading' || s.status === 'error')) {
    return false;
  }
  const profitLoss = data.profitLoss.data;
  const noProfitLoss =
    !profitLoss ||
    [profitLoss.income, profitLoss.spend].every((series) =>
      series.current.every((value) => value === 0),
    );
  const noCash = !data.cash.data || data.cash.data.accounts.length === 0;
  const noReceivable =
    !data.receivable.data || data.receivable.data.total === 0;
  const noPayable = !data.payable.data || data.payable.data.total === 0;
  return noProfitLoss && noCash && noReceivable && noPayable;
}

function OverviewEmptyState() {
  const history = useHistory();
  return (
    <section className={styles.empty} data-testId="overview-empty">
      <h3>{intl.get('homepage.overview.empty_title')}</h3>
      <p>{intl.get('homepage.overview.empty_description')}</p>
      <div className={styles.actions}>
        <Button
          intent={Intent.PRIMARY}
          onClick={() => history.push(BANK_ACCOUNTS_LINK)}
        >
          {intl.get('homepage.overview.add_bank_account')}
        </Button>
        <Button onClick={() => history.push(NEW_INVOICE_LINK)}>
          {intl.get('homepage.overview.create_invoice')}
        </Button>
      </div>
    </section>
  );
}

interface HomepageOverviewProps {
  compare: boolean;
  panels: OverviewPanelPref[];
}

/**
 * Homepage overview: status sentence, twelve-month lock strip, tiles and a
 * compact profit and loss, all from existing report endpoints.
 */
export function HomepageOverview({ compare, panels }: HomepageOverviewProps) {
  const visible = panels.filter((panel) => panel.visible);
  const data = useOverviewData({
    cashFlow: visible.some((panel) => panel.id === 'cash-flow'),
  });

  return (
    <div className={styles.root} data-testId="homepage-overview">
      {isNewOrganization(data) ? (
        <OverviewEmptyState />
      ) : (
        <>
          <OverviewStatus data={data} compare={compare} />
          <OverviewStrip data={data} compare={compare} />
          <OverviewTiles data={data} compare={compare} panels={visible} />
          <OverviewStatement data={data} compare={compare} />
        </>
      )}
    </div>
  );
}
