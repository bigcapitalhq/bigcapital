// @ts-nocheck
import { useIsFetching } from '@tanstack/react-query';
import React from 'react';
import Progress from './Progress';

function AppProgress() {
  const isFetching = useIsFetching();

  return <Progress isAnimating={isFetching} />;
}

export default AppProgress;
