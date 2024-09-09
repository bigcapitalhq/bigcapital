// @ts-nocheck
import React from 'react';
import * as R from 'ramda';
import { Button, Intent } from '@blueprintjs/core';
import { Group, Stack } from '@/components';
import { InvoiceCustomizeHeader } from './InvoiceCustomizeHeader';
import { InvoiceCustomizeTabs } from './InvoiceCustomizeTabs';
import { useInvoiceCustomizeTabsController } from './InvoiceCustomizeTabsController';
import { useDrawerContext } from '@/components/Drawer/DrawerProvider';
import { useFormikContext } from 'formik';
import { useInvoiceCustomizeContext } from './InvoiceCustomizeProvider';
import styles from './InvoiceCustomizeFields.module.scss';
import withDrawerActions from '@/containers/Drawer/withDrawerActions';

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
  const { CustomizeTabs } = useInvoiceCustomizeContext();

  const CustomizeTabPanel = React.useMemo(
    () =>
      React.Children.map(CustomizeTabs, (tab) => {
        return tab.props.id === currentTabId ? tab : null;
      }).filter(Boolean),
    [CustomizeTabs, currentTabId],
  );

  return (
    <Stack spacing={0} className={styles.mainFields}>
      <InvoiceCustomizeHeader label={'Customize'} />

      <Stack spacing={0} style={{ flex: '1 1 auto', overflow: 'auto' }}>
        {CustomizeTabPanel}
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
      <Button
        onClick={handleSubmitBtnClick}
        intent={Intent.PRIMARY}
        style={{ minWidth: 75 }}
      >
        Save
      </Button>
      <Button onClick={handleCancelBtnClick}>Cancel</Button>
    </Group>
  );
}

const InvoiceCustomizeFooterActions = R.compose(withDrawerActions)(
  InvoiceCustomizeFooterActionsRoot,
);
