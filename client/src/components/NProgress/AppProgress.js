
import React from 'react';
import Progress from './Progress';
import {queryCache, useIsFetching} from 'react-query';

function AppProgress({

}) {
  const isFetching = useIsFetching();

  return (
    <Progress isAnimating={isFetching} />
  );
};
 
export default AppProgress;