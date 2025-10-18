import { css } from '@emotion/css';
import { Tabs } from '@blueprintjs/core';

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

        .bp4-dark & {
          --x-color-background: var(--color-dark-gray2);
          --x-color-border: rgba(255, 255, 255, 0.2);
          --x-color-tab-text: rgba(255, 255, 255, 0.6);
        }
        overflow: hidden;
        flex: 1 1;
        display: flex;
        flex-direction: column;

        .bp4-tab-list {
          padding: 0 20px;
          background: var(--x-color-background);
          border-bottom: 1px solid var(--x-color-border);
        }
        .bp4-tab {
          line-height: 40px;
        }
        .bp4-tab:not([aria-selected='true']) {
          color: var(--x-color-tab-text);
        }
        .bp4-tab-indicator-wrapper .bp4-tab-indicator {
          height: 2px;
        }
        .bp4-tab-panel {
          margin: 0;
          overflow: auto;
        }
      `}
    >
      {children}
    </Tabs>
  );
}
