// @ts-nocheck
import * as R from 'ramda';
import BigcapitalLoading from './BigcapitalLoading';
import withDashboard from '@/containers/Dashboard/withDashboard';

function SplashScreenComponent({ splashScreenLoading }) {
  return splashScreenLoading ? <BigcapitalLoading /> : null;
}

export const SplashScreen = R.compose(
  withDashboard(({ splashScreenLoading }) => ({
    splashScreenLoading,
  })),
)(SplashScreenComponent);
