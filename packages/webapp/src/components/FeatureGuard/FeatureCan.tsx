import React from 'react';
import { useSelector } from 'react-redux';
import { getDashboardFeaturesSelector } from '@/store/dashboard/dashboard.selectors';

interface FeatureCanProps {
  feature: string;
  children?: React.ReactNode;
}

export function FeatureCan({ feature, children }: FeatureCanProps) {
  const features = useSelector(getDashboardFeaturesSelector()) as Record<
    string,
    unknown
  >;

  const isFeatureCan = !!(feature && features[feature]);

  return isFeatureCan ? <>{children}</> : null;
}
