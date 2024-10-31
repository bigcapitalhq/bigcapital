// @ts-nocheck
import React from 'react';
import * as R from 'ramda';
import { Button, Intent } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import { Box, Group, Stack } from '@/components';
import { ElementCustomizeHeader } from './ElementCustomizeHeader';
import { ElementCustomizeTabs } from './ElementCustomizeTabs';
import { useElementCustomizeTabsController } from './ElementCustomizeTabsController';
import { useDrawerContext } from '@/components/Drawer/DrawerProvider';
import { useElementCustomizeContext } from './ElementCustomizeProvider';
import withDrawerActions from '@/containers/Drawer/withDrawerActions';
import styles from './ElementCustomize.module.scss';

export function ElementCustomizeFields() {
  return (
    <Group spacing={0} align={'stretch'} className={styles.root}>
      <ElementCustomizeTabs />
      <ElementCustomizeFieldsMain />
    </Group>
  );
}

export function ElementCustomizeFieldsMain() {
  const { currentTabId } = useElementCustomizeTabsController();
  const { CustomizeTabs } = useElementCustomizeContext();

  const CustomizeTabPanel = React.useMemo(
    () =>
      React.Children.map(CustomizeTabs, (tab) => {
        return tab.props.id === currentTabId ? tab : null;
      }).filter(Boolean),
    [CustomizeTabs, currentTabId],
  );

  return (
    <Stack spacing={0} className={styles.mainFields}>
      <ElementCustomizeHeader label={'Customize'} />

      <Stack spacing={0} flex="1 1 auto" overflow="auto">
        <Box flex={'1 1'} overflow="auto">
          {CustomizeTabPanel}
        </Box>
        <ElementCustomizeFooterActions />
      </Stack>
    </Stack>
  );
}

function ElementCustomizeFooterActionsRoot({ closeDrawer }) {
  const { name } = useDrawerContext();
  const { submitForm, isSubmitting } = useFormikContext();

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
        loading={isSubmitting}
        type={'submit'}
      >
        Save
      </Button>
      <Button onClick={handleCancelBtnClick}>Cancel</Button>
    </Group>
  );
}

const ElementCustomizeFooterActions = R.compose(withDrawerActions)(
  ElementCustomizeFooterActionsRoot,
);
