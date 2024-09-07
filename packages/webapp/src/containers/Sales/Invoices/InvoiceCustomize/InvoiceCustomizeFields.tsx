import { Box, Group } from '@/components';
import { InvoiceCustomizeHeader } from './InvoiceCustomizeHeader';
import { InvoiceCustomizeTabs } from './InvoiceCustomizeTabs';
import styles from './InvoiceCustomizeFields.module.scss';
import { InvoiceCustomizeGeneralField } from './InvoiceCustomizeGeneralFields';
import { useInvoiceCustomizeTabsController } from './InvoiceCustomizeTabsController';

export function InvoiceCustomizeFields() {
  return (
    <Group spacing={0} align={'stretch'} className={styles.root}>
      <InvoiceCustomizeTabs />
      <InvoiceCustomizeFieldsMain />
    </Group>
  );
}

export function InvoiceCustomizeFieldsMain() {
  const { currentTabId } = useInvoiceCustomizeTabsController();
  return (
    <Box className={styles.mainFields}>
      <InvoiceCustomizeHeader label={'Customize'} />

      {currentTabId === 'general' && <InvoiceCustomizeGeneralField />}
    </Box>
  );
}
