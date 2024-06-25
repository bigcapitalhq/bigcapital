import React from 'react';
import { AppShellProvider } from './AppShellProvider';
import { Box } from '../Layout';
import styles from './AppShell.module.scss';

interface AppShellProps {
  topbarOffset?: number;
  mainProps: any;
  asideProps: any;
  children: React.ReactNode;
}

export function AppShell({
  asideProps,
  mainProps,
  topbarOffset = 0,
  ...restProps
}: AppShellProps) {
  return (
    <AppShellProvider mainProps={mainProps} asideProps={asideProps} topbarOffset={topbarOffset}>
      <Box {...restProps} className={styles.root} />
    </AppShellProvider>
  );
}

AppShell.Main = AppShellMain;
AppShell.Aside = AppShellAside;

function AppShellMain({ ...props }) {
  return <Box {...props} className={styles.main} />;
}

interface AppShellAsideProps {
  children: React.ReactNode;
}

function AppShellAside({ ...props }: AppShellAsideProps) {
  return <Box {...props} className={styles.aside} />;
}
