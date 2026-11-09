import { Tab, TabProps, Tabs } from '@blueprintjs/core';
import React from 'react';
import { ElementCustomizeHeader } from './ElementCustomizeHeader';
import { useElementCustomizeContext } from './ElementCustomizeProvider';
import styles from './ElementCustomizeTabs.module.scss';
import {
  ElementCustomizeTabsEnum,
  useElementCustomizeTabsController,
} from './ElementCustomizeTabsController';
import { Box, Stack } from '@/components';

export function ElementCustomizeTabs() {
  const { setCurrentTabId } = useElementCustomizeTabsController();
  const { CustomizeTabs } = useElementCustomizeContext();

  const tabItems = React.Children.map(CustomizeTabs, (node) => ({
    ...(React.isValidElement(node) ? node.props : {}),
  }));
  const handleChange = (value: ElementCustomizeTabsEnum) => {
    setCurrentTabId(value);
  };
  return (
    <Stack spacing={0} className={styles.root}>
      <ElementCustomizeHeader label={''} />

      <Box className={styles.content}>
        <Tabs
          vertical
          fill
          large
          onChange={handleChange}
          className={styles.tabsList}
        >
          {tabItems?.map(
            ({
              id,
              label,
              tabProps,
            }: {
              id: string;
              label: string;
              tabProps?: TabProps;
            }) => <Tab id={id} key={id} title={label} {...tabProps} />,
          )}
        </Tabs>
      </Box>
    </Stack>
  );
}
