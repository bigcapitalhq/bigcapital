import { css } from '@emotion/css';
import { Tabs, TabsProps } from '@blueprintjs/core';

interface InvoiceCustomizeTabsProps extends TabsProps { }

export function InvoiceCustomizeTabs(props: InvoiceCustomizeTabsProps) {
  return (
    <Tabs
      className={css`
        overflow: hidden;
        flex: 1 1;
        display: flex;
        flex-direction: column;

        .bp4-tab-list {
          padding: 0 20px;
          background: var(--color-element-customize-header-tabs-background);
          border-bottom: 1px solid var(--color-element-customize-divider);
        }
        .bp4-tab {
          line-height: 40px;
        }
        .bp4-tab:not([aria-selected='true']) {
          color: var(--color-ekement-customize-header-tabs-text);
        }
        .bp4-tab-indicator-wrapper .bp4-tab-indicator {
          height: 2px;
        }
        .bp4-tab-panel{
          margin: 0;
          overflow: auto;
        }
      `}
      {...props}
    />
  );
}
