import { Box, Stack } from '@/components';
import { Tab, Tabs } from '@blueprintjs/core';
import { InvoiceCustomizeHeader } from './InvoiceCustomizeHeader';
import {
  InvoiceCustomizeTabsEnum,
  useInvoiceCustomizeTabsController,
} from './InvoiceCustomizeTabsController';
import styles from './InvoiceCustomizeTabs.module.scss';
import { useInvoiceCustomizeContext } from './InvoiceCustomizeProvider';
import React from 'react';

export function InvoiceCustomizeTabs() {
  const { setCurrentTabId } = useInvoiceCustomizeTabsController();

  const { CustomizeTabs } = useInvoiceCustomizeContext();

  const tabItems = React.Children.map(CustomizeTabs, (node) => ({
    ...(React.isValidElement(node) ? node.props : {}),
  }));
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
          {tabItems?.map(({ id, label }: { id: string; label: string }) => (
            <Tab id={id} key={id} title={label} />
          ))}
        </Tabs>
      </Box>
    </Stack>
  );
}
