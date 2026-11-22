import { Tabs, TabsProps } from '@blueprintjs/core';
import { css } from '@emotion/css';

interface InvoiceCustomizeTabsProps extends TabsProps {}

export function InvoiceCustomizeTabs(props: InvoiceCustomizeTabsProps) {
  return (
    <Tabs
      className={css`
        overflow: hidden;
        flex: 1 1;
        display: flex;
        flex-direction: column;

        .bp6-tab-list {
          padding: 0 20px;
          background: var(--color-element-customize-header-tabs-background);
          border-bottom: 1px solid var(--color-element-customize-divider);
        }
        .bp6-tab {
          line-height: 40px;
        }
        .bp6-tab:not([aria-selected='true']) {
          color: var(--color-ekement-customize-header-tabs-text);
        }
        .bp6-tab-indicator-wrapper .bp6-tab-indicator {
          height: 2px;
        }
        .bp6-tab-panel {
          margin: 0;
          overflow: auto;
        }
      `}
      {...props}
    />
  );
}
