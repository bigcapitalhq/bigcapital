import React from 'react';
import ContentLoader from 'react-content-loader';
import { useIsDarkMode } from '@/hooks/useDarkMode';

export type PreferencesPageLoaderProps = React.ComponentProps<
  typeof ContentLoader
>;

export function PreferencesPageLoader(props: PreferencesPageLoaderProps) {
  const isDarkmode = useIsDarkMode();

  return (
    <ContentLoader
      speed={2}
      width={400}
      height={250}
      viewBox="0 0 400 250"
      backgroundColor={isDarkmode ? 'rgba(255, 255, 255, 0.15)' : '#f3f3f3'}
      foregroundColor={isDarkmode ? 'rgba(255, 255, 255, 0.3)' : '#e6e6e6'}
      {...props}
    >
      <rect x="0" y="82" rx="2" ry="2" width="200" height="20" />
      <rect x="0" y="112" rx="2" ry="2" width="385" height="30" />
      <rect x="0" y="0" rx="2" ry="2" width="200" height="20" />
      <rect x="-1" y="30" rx="2" ry="2" width="385" height="30" />
      <rect x="0" y="164" rx="2" ry="2" width="200" height="20" />
      <rect x="0" y="194" rx="2" ry="2" width="385" height="30" />
    </ContentLoader>
  );
}
