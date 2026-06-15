// @ts-nocheck
import * as R from 'ramda';
import BigcapitalLoading from './BigcapitalLoading';
import { withDashboard } from '@/containers/Dashboard/withDashboard';
import { flow } from 'fp-ts/function';

function SplashScreenComponent({ splashScreenLoading }) {
  return splashScreenLoading ? <BigcapitalLoading /> : null;
}

export const SplashScreen = flow(
  withDashboard(({ splashScreenLoading }) => ({
    splashScreenLoading,
  })),
)(SplashScreenComponent);
