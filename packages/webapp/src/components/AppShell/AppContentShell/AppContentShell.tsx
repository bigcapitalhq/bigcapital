import React from 'react';
import { AppShellProvider, useAppShellContext } from './AppContentShellProvider';
import { Box, BoxProps } from '../../Layout';
import styles from './AppShell.module.scss';

interface AppContentShellProps {
  topbarOffset?: number;
  mainProps?: BoxProps;
  asideProps?: BoxProps;
  children: React.ReactNode;
  hideAside?: boolean;
  hideMain?: boolean;
}

export function AppContentShell({
  asideProps,
  mainProps,
  topbarOffset = 0,
  hideAside = false,
  hideMain = false,
  ...restProps
}: AppContentShellProps) {
  return (
    <AppShellProvider
      mainProps={mainProps}
      asideProps={asideProps}
      topbarOffset={topbarOffset}
      hideAside={hideAside}
      hideMain={hideMain}
    >
      <Box {...restProps} className={styles.root} />
    </AppShellProvider>
  );
}

interface AppContentShellMainProps extends BoxProps {}

function AppContentShellMain({ ...props }: AppContentShellMainProps) {
  const { hideMain } = useAppShellContext();

  if (hideMain === true) {
    return null;
  }
  return <Box {...props} className={styles.main} />;
}

interface AppContentShellAsideProps extends BoxProps {
  children: React.ReactNode;
}

function AppContentShellAside({ ...props }: AppContentShellAsideProps) {
  const { hideAside } = useAppShellContext();

  if (hideAside === true) {
    return null;
  }
  return <Box {...props} className={styles.aside} />;
}

AppContentShell.Main = AppContentShellMain;
AppContentShell.Aside = AppContentShellAside;
