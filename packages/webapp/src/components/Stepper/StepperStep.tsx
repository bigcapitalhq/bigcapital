// @ts-nocheck
import { StepperStepState } from './types';
import styled from 'styled-components';
import { Icon } from '../Icon';

interface StepperStepProps {
  label: string;
  description?: string;
  children: React.ReactNode;
  step?: number;
  active?: boolean;
  state?: StepperStepState;
  allowStepClick?: boolean;
}

export function StepperStep({
  label,
  description,
  step,
  active,
  state,
  children,
}: StepperStepProps) {
  return (
    <StepButton>
      <StepIconWrap>
        <StepIcon
          isCompleted={state === StepperStepState.Completed}
          isActive={state === StepperStepState.Progress}
        >
          {state === StepperStepState.Completed ? (
            <Icon icon={'done'} iconSize={24} />
          ) : (
            <StepIconText>{step}</StepIconText>
          )}
        </StepIcon>
      </StepIconWrap>

      <StepTextWrap>
        <StepTitle
          isCompleted={state === StepperStepState.Completed}
          isActive={state === StepperStepState.Progress}
        >
          {label}
        </StepTitle>
        {description && (
          <StepDescription
            isCompleted={state === StepperStepState.Completed}
            isActive={state === StepperStepState.Progress}
          >
            {description}
          </StepDescription>
        )}
      </StepTextWrap>
    </StepButton>
  );
}

const StepButton = styled.button`
  background: transparent;
  color: inherit;
  border: 0;
  align-items: center;
  display: flex;
  gap: 10px;
  text-align: left;
`;

const StepIcon = styled.span`
  display: block;
  height: 24px;
  width: 24px;
  display: block;
  line-height: 24px;
  border-radius: 24px;
  text-align: center;
  background-color: ${(props) =>
    props.isCompleted || props.isActive
      ? 'var(--color-stepper-step-active-background)'
      : 'var(--color-stepper-step-background)'};
  color: var(--color-stepper-step-text);
  margin: auto;
  font-size: 12px;
`;

const StepTitle = styled.div`
  color: ${(props) =>
    props.isCompleted || props.isActive
      ? 'var(--color-stepper-step-title-active-text)'
      : 'var(--color-stepper-step-title-text)'};
`;
const StepDescription = styled.div`
  font-size: 12px;
  margin-top: 10px;
  color: ${(props) =>
    props.isCompleted || props.isActive
      ? 'var(--color-stepper-step-description-active-text)'
      : 'var(--color-stepper-step-description-text)'};
`;

const StepIconWrap = styled.div`
  display: flex;
`;

const StepTextWrap = styled.div`
  text-align: left;
`;

const StepIconText = styled.div``;
