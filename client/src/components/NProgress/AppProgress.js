
import React from 'react';
import {connect} from 'react-redux';
import Progress from './Progress';

function AppProgress({
  isAnimating,
}) {
  return (
    <Progress isAnimating={isAnimating} />
  );
};

const mapStateToProps = (state) => ({
  isAnimating: state.dashboard.requestsLoading > 0,
});

export default connect(mapStateToProps)(AppProgress);