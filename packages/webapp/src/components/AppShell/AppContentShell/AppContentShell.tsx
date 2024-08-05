// @ts-nocheck
import React, { forwardRef, Ref } from 'react';
import {
  AppShellProvider,
  useAppShellContext,
} from './AppContentShellProvider';
import { Box, BoxProps } from '../../Layout';
import styles from './AppContentShell.module.scss';

interface AppContentShellProps {
  topbarOffset?: number;
  mainProps?: BoxProps;
  asideProps?: BoxProps;
  children: React.ReactNode;
  hideAside?: boolean;
  hideMain?: boolean;
}

export const AppContentShell = forwardRef(
  (
    {
      asideProps,
      mainProps,
      topbarOffset = 0,
      hideAside = false,
      hideMain = false,
      ...restProps
    }: AppContentShellProps,
    ref: Ref<HTMLDivElement>,
  ) => {
    return (
      <AppShellProvider
        mainProps={mainProps}
        asideProps={asideProps}
        topbarOffset={topbarOffset}
        hideAside={hideAside}
        hideMain={hideMain}
      >
        <Box {...restProps} className={styles.root} ref={ref} />
      </AppShellProvider>
    );
  },
);
AppContentShell.displayName = 'AppContentShell';

interface AppContentShellMainProps extends BoxProps {}

/**
 * Main content of the app shell.
 * @param {AppContentShellMainProps} props -
 * @returns {React.ReactNode}
 */
const AppContentShellMain = forwardRef(
  ({ ...props }: AppContentShellMainProps, ref: Ref<HTMLDivElement>) => {
    const { hideMain } = useAppShellContext();

    if (hideMain === true) {
      return null;
    }
    return <Box {...props} className={styles.main} ref={ref} />;
  },
);

AppContentShellMain.displayName = 'AppContentShellMain';

interface AppContentShellAsideProps extends BoxProps {
  children: React.ReactNode;
}

/**
 * Aside content of the app shell.
 * @param {AppContentShellAsideProps} props
 * @returns {React.ReactNode}
 */
const AppContentShellAside = forwardRef(
  ({ ...props }: AppContentShellAsideProps, ref: Ref<HTMLDivElement>) => {
    const { hideAside } = useAppShellContext();

    if (hideAside === true) {
      return null;
    }
    return <Box {...props} className={styles.aside} ref={ref} />;
  },
);
AppContentShellAside.displayName = 'AppContentShellAside';

AppContentShell.Main = AppContentShellMain;
AppContentShell.Aside = AppContentShellAside;
