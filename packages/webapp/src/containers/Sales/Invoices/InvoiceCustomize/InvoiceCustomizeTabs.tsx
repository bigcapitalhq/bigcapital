import { Box } from '@/components';
import { Tab, Tabs } from '@blueprintjs/core';
import { InvoiceCustomizeHeader } from './InvoiceCustomizeHeader';
import styles from './InvoiceCustomizeTabs.module.scss';
import {
  InvoiceCustomizeTabsEnum,
  useInvoiceCustomizeTabsController,
} from './InvoiceCustomizeTabsController';

export function InvoiceCustomizeTabs() {
  const { setCurrentTabId } = useInvoiceCustomizeTabsController();

  const handleChange = (value: InvoiceCustomizeTabsEnum) => {
    setCurrentTabId(value);
  };
  return (
    <Box className={styles.root}>
      <InvoiceCustomizeHeader label={''} />

      <Box className={styles.content}>
        <Tabs vertical fill onChange={handleChange} className={styles.tabsList}>
          <Tab id="general" title="General" />
          <Tab id="content" title="Content" />
          <Tab id="total" title="Total" />
        </Tabs>
      </Box>
    </Box>
  );
}
