import React from 'react';
import { useFeatureCan } from '@/hooks/state';

interface FeatureCanProps {
  feature: string;
  children?: React.ReactNode;
}

export function FeatureCan({ feature, children }: FeatureCanProps) {
  const { featureCan } = useFeatureCan();

  return featureCan(feature) ? <>{children}</> : null;
}
