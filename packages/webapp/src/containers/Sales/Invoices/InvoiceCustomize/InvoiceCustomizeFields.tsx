// @ts-nocheck
import * as R from 'ramda';
import { Box, Group, Stack } from '@/components';
import { InvoiceCustomizeHeader } from './InvoiceCustomizeHeader';
import { InvoiceCustomizeTabs } from './InvoiceCustomizeTabs';
import styles from './InvoiceCustomizeFields.module.scss';
import { InvoiceCustomizeGeneralField } from './InvoiceCustomizeGeneralFields';
import { useInvoiceCustomizeTabsController } from './InvoiceCustomizeTabsController';
import { Button, Intent } from '@blueprintjs/core';
import withDrawerActions from '@/containers/Drawer/withDrawerActions';
import { useDrawerContext } from '@/components/Drawer/DrawerProvider';
import { useFormikContext } from 'formik';
import { InvoiceCustomizeContentFields } from './InvoiceCutomizeContentFields';

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
    <Stack spacing={0} className={styles.mainFields}>
      <InvoiceCustomizeHeader label={'Customize'} />

      <Stack spacing={0} style={{ flex: '1 1 auto' }}>
        {currentTabId === 'general' && <InvoiceCustomizeGeneralField />}
        {currentTabId === 'content' && <InvoiceCustomizeContentFields />}

        <InvoiceCustomizeFooterActions />
      </Stack>
    </Stack>
  );
}

function InvoiceCustomizeFooterActionsRoot({ closeDrawer }) {
  const { name } = useDrawerContext();
  const { submitForm } = useFormikContext();

  const handleSubmitBtnClick = () => {
    submitForm();
  };
  const handleCancelBtnClick = () => {
    closeDrawer(name);
  };

  return (
    <Group spacing={10} className={styles.footerActions}>
      <Button onClick={handleSubmitBtnClick} intent={Intent.PRIMARY}>
        Save
      </Button>
      <Button onClick={handleCancelBtnClick}>Cancel</Button>
    </Group>
  );
}

const InvoiceCustomizeFooterActions = R.compose(withDrawerActions)(
  InvoiceCustomizeFooterActionsRoot,
);
