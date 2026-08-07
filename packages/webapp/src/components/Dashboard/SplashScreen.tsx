import * as R from 'ramda';
import BigcapitalLoading from './BigcapitalLoading';
import { withDashboard } from '@/containers/Dashboard/withDashboard';

interface SplashScreenProps {
  splashScreenLoading: boolean;
}

function SplashScreenComponent({ splashScreenLoading }: SplashScreenProps) {
  return splashScreenLoading ? <BigcapitalLoading /> : null;
}

export const SplashScreen = R.compose(
  withDashboard(({ splashScreenLoading }) => ({
    splashScreenLoading,
  })),
)(SplashScreenComponent);
