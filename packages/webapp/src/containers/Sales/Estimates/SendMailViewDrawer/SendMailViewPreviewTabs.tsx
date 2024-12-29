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
          overflow: hidden;
          flex: 1 1;
          display: flex;
          flex-direction: column;

          .bp4-tab-list {
            padding: 0 20px;
            background: #fff;
            border-bottom: 1px solid #dcdcdd;
          }
          .bp4-tab {
            line-height: 40px;
          }
          .bp4-tab:not([aria-selected='true']) {
            color: #5f6b7c;
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
