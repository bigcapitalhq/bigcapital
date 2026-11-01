import * as FF from 'fp-ts/function';
import BigcapitalLoading from './BigcapitalLoading';
import { withDashboard } from '@/containers/Dashboard/withDashboard';

interface SplashScreenProps {
  splashScreenLoading: boolean;
}

function SplashScreenComponent({ splashScreenLoading }: SplashScreenProps) {
  return splashScreenLoading ? <BigcapitalLoading /> : null;
}

export const SplashScreen = FF.pipe(
  SplashScreenComponent,
  withDashboard(({ splashScreenLoading }) => ({
    splashScreenLoading,
  })),
);
