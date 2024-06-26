import React from 'react';
import { AppShellProvider, useAppShellContext } from './AppShellProvider';
import { Box } from '../Layout';
import styles from './AppShell.module.scss';

interface AppShellProps {
  topbarOffset?: number;
  mainProps: any;
  asideProps: any;
  children: React.ReactNode;
  hideAside?: boolean;
  hideMain?: boolean;
}

export function AppShell({
  asideProps,
  mainProps,
  topbarOffset = 0,
  hideAside = false,
  hideMain = false,
  ...restProps
}: AppShellProps) {
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

AppShell.Main = AppShellMain;
AppShell.Aside = AppShellAside;

function AppShellMain({ ...props }) {
  const { hideMain } = useAppShellContext();

  if (hideMain === true) {
    return null;
  }

  return <Box {...props} className={styles.main} />;
}

interface AppShellAsideProps {
  children: React.ReactNode;
}

function AppShellAside({ ...props }: AppShellAsideProps) {
  const { hideAside } = useAppShellContext();

  console.log(hideAside, 'hideAsidehideAsidehideAsidehideAside');
  if (hideAside === true) {
    return null;
  }
  return <Box {...props} className={styles.aside} />;
}
