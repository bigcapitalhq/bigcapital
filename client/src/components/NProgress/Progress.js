import { useNProgress } from '@tanem/react-nprogress'
import PropTypes from 'prop-types'
import React from 'react'
import Bar from './Bar'
import Container from './Container'
import Spinner from './Spinner'

const Progress = ({
  isAnimating,
  minimum = 0.2
}) => {
  const { animationDuration, isFinished, progress } = useNProgress({
    isAnimating, minimum,
  });

  return (
    <Container isFinished={isFinished} animationDuration={animationDuration}>
      <Bar progress={progress} animationDuration={animationDuration} />
    </Container>
  )
}

Progress.propTypes = {
  isAnimating: PropTypes.bool.isRequired,
};

export default Progress;
