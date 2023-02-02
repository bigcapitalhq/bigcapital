// @ts-nocheck
import React from 'react';

export default function SetupSteps({ step, children }) {
  const activeStep = React.Children.toArray(children).filter(
    (child) => child.props.id === step.id,
  );
  return activeStep;
}
