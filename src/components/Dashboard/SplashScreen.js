import React from 'react';
import * as R from 'ramda';
import BigcapitalLoading from './BigcapitalLoading';
import withDashboard from '../../containers/Dashboard/withDashboard';

function SplashScreenComponent({ appIsLoading, appIntlIsLoading }) {
  return appIsLoading || appIntlIsLoading ? <BigcapitalLoading /> : null;
}

export const SplashScreen = R.compose(
  withDashboard(({ appIsLoading, appIntlIsLoading }) => ({
    appIsLoading,
    appIntlIsLoading,
  })),
)(SplashScreenComponent);
