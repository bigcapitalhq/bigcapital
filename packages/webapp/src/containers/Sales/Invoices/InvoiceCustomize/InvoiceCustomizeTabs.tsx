import { Box, Stack } from '@/components';
import { Tab, Tabs } from '@blueprintjs/core';
import { InvoiceCustomizeHeader } from './InvoiceCustomizeHeader';
import {
  InvoiceCustomizeTabsEnum,
  useInvoiceCustomizeTabsController,
} from './InvoiceCustomizeTabsController';
import styles from './InvoiceCustomizeTabs.module.scss';

export function InvoiceCustomizeTabs() {
  const { setCurrentTabId } = useInvoiceCustomizeTabsController();

  const handleChange = (value: InvoiceCustomizeTabsEnum) => {
    setCurrentTabId(value);
  };
  return (
    <Stack spacing={0} className={styles.root}>
      <InvoiceCustomizeHeader label={''} />

      <Box className={styles.content}>
        <Tabs
          vertical
          fill
          large
          onChange={handleChange}
          className={styles.tabsList}
        >
          <Tab id="general" title="General" />
          <Tab id="content" title="Content" />
          <Tab id="total" title="Total" />
        </Tabs>
      </Box>
    </Stack>
  );
}
