import { Tabs, TabsProps } from '@blueprintjs/core';
import { css } from '@emotion/css';
import { NS } from '@/constants/classes';

interface InvoiceCustomizeTabsProps extends TabsProps {}

export function InvoiceCustomizeTabs(props: InvoiceCustomizeTabsProps) {
  return (
    <Tabs
      className={css`
        overflow: hidden;
        flex: 1 1;
        display: flex;
        flex-direction: column;

        .${NS}-tab-list {
          padding: 0 20px;
          background: var(--color-element-customize-header-tabs-background);
          border-bottom: 1px solid var(--color-element-customize-divider);
        }
        .${NS}-tab {
          line-height: 40px;
        }
        .${NS}-tab:not([aria-selected='true']) {
          color: var(--color-ekement-customize-header-tabs-text);
        }
        .${NS}-tab-indicator-wrapper .${NS}-tab-indicator {
          height: 2px;
        }
        .${NS}-tab-panel {
          margin: 0;
          overflow: auto;
        }
      `}
      {...props}
    />
  );
}
