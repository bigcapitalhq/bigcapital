import { Tabs } from '@blueprintjs/core';
import { css } from '@emotion/css';

interface SendMailViewPreviewTabsProps {
  children: React.ReactNode;
}

export function SendMailViewPreviewTabs({
  children,
}: SendMailViewPreviewTabsProps) {
  return (
    <Tabs
      id={'preview'}
      defaultSelectedTabId={'payment-page'}
      className={css`
        --x-color-background: var(--color-white);
        --x-color-border: #dcdcdd;
        --x-color-tab-text: #5f6b7c;

        .bp6-dark & {
          --x-color-background: var(--color-dark-gray2);
          --x-color-border: rgba(255, 255, 255, 0.2);
          --x-color-tab-text: rgba(255, 255, 255, 0.6);
        }
        overflow: hidden;
        flex: 1 1;
        display: flex;
        flex-direction: column;

        .bp6-tab-list {
          padding: 0 20px;
          background: var(--x-color-background);
          border-bottom: 1px solid var(--x-color-border);
        }
        .bp6-tab {
          line-height: 40px;
        }
        .bp6-tab:not([aria-selected='true']) {
          color: var(--x-color-tab-text);
        }
        .bp6-tab-indicator-wrapper .bp6-tab-indicator {
          height: 2px;
        }
        .bp6-tab-panel {
          margin: 0;
          overflow: auto;
        }
      `}
    >
      {children}
    </Tabs>
  );
}
