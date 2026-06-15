// @ts-nocheck
import React from 'react';
import * as R from 'ramda';
import { withFeatureCan } from './withFeatureCan';
import { flow } from 'fp-ts/function';

function FeatureCanJSX({ feature, children, isFeatureCan }) {
  return isFeatureCan && children;
}

export const FeatureCan = flow(
  withFeatureCan(({ isFeatureCan }) => ({
    isFeatureCan,
  })),
)(FeatureCanJSX);
