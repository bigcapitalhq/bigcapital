// @ts-nocheck
import { cloneElement } from 'react';
import styled from 'styled-components';
import { toArray } from 'lodash';
import { Box } from '../Layout';
import { StepperCompleted } from './StepperCompleted';
import { StepperStep } from './StepperStep';
import { StepperStepState } from './types';

export interface StepperProps {
  /** <Stepper.Step /> components */
  children: React.ReactNode;

  /** Index of the active step */
  active: number;

  /** Called when step is clicked */
  onStepClick?: (stepIndex: number) => void;

  /** Determines whether next steps can be selected, `true` by default **/
  allowNextStepsSelect?: boolean;

  classNames?: Record<string, string>;
}

export function Stepper({
  active,
  onStepClick,
  children,
  classNames,
}: StepperProps) {
  const convertedChildren = toArray(children) as React.ReactElement[];
  const _children = convertedChildren.filter(
    (child) => child.type !== StepperCompleted,
  );
  const completedStep = convertedChildren.find(
    (item) => item.type === StepperCompleted,
  );
  const items = _children.reduce<React.ReactElement[]>((acc, item, index) => {
    const state =
      active === index
        ? StepperStepState.Progress
        : active > index
        ? StepperStepState.Completed
        : StepperStepState.Inactive;

    const shouldAllowSelect = () => {
      if (typeof onStepClick !== 'function') {
        return false;
      }
      if (typeof item.props.allowStepSelect === 'boolean') {
        return item.props.allowStepSelect;
      }
      return state === 'stepCompleted' || allowNextStepsSelect;
    };
    const isStepSelectionEnabled = shouldAllowSelect();

    acc.push(
      cloneElement(item, {
        key: index,
        step: index + 1,
        state,
        onClick: () => isStepSelectionEnabled && onStepClick?.(index),
        allowStepClick: isStepSelectionEnabled,
      }),
    );
    if (index !== _children.length - 1) {
      acc.push(
        <StepSeparator
          data-active={index < active || undefined}
          key={`separator-${index}`}
        />,
      );
    }
    return acc;
  }, []);

  const stepContent = _children[active]?.props?.children;
  const completedContent = completedStep?.props?.children;
  const content =
    active > _children.length - 1 ? completedContent : stepContent;

  return (
    <Box className={classNames?.root}>
      <StepsItems className={classNames?.items}>{items}</StepsItems>
      <StepsContent className={classNames?.content}>{content} </StepsContent>
    </Box>
  );
}

Stepper.Step = StepperStep;
Stepper.Completed = StepperCompleted;
Stepper.displayName = '@bigcapital/core/stepper';

const StepsItems = styled(Box)`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
`;
const StepsContent = styled(Box)`
  margin-top: 16px;
  margin-bottom: 8px;
`;
const StepSeparator = styled.div`
  flex: 1;
  display: block;
  border-color: #c5cbd3;
  border-top-style: solid;
  border-top-width: 1px;
`;
