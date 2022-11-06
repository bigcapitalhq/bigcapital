// @ts-nocheck
import React from 'react';
import Progress from './Progress';
import {useIsFetching} from 'react-query';

function AppProgress() {
  const isFetching = useIsFetching();

  return (
    <Progress isAnimating={isFetching} />
  );
};
 
export default AppProgress;