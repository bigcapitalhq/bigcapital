import {
  Intent,
  Button,
  ButtonGroup,
  Popover,
  PopoverInteractionKind,
  Position,
  Menu,
  MenuItem,
} from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import React from 'react';
import styled from 'styled-components';
import { useCustomerFormContext } from './CustomerFormProvider';
import { Group, Icon, FormattedMessage as T } from '@/components';

export function CustomerFloatingActions() {
  // Customer form context.
  const { isNewMode, setSubmitPayload } = useCustomerFormContext() as {
    isNewMode: boolean;
    setSubmitPayload: (payload: { noRedirect: boolean }) => void;
  };

  // Formik context.
  const { submitForm, isSubmitting } = useFormikContext();

  // Handle submit button click.
  const handleSubmitBtnClick = (_event: React.MouseEvent<HTMLElement>) => {
    setSubmitPayload({ noRedirect: false });
  };

  // Handle submit & new button click.
  const handleSubmitAndNewClick = (_event: React.MouseEvent<HTMLElement>) => {
    submitForm();
    setSubmitPayload({ noRedirect: true });
  };

  return (
    <FloatingActionsGroup spacing={10}>
      <ButtonGroup>
        {/* ----------- Save and New ----------- */}
        <Button
          disabled={isSubmitting}
          loading={isSubmitting}
          intent={Intent.PRIMARY}
          type="submit"
          onClick={handleSubmitBtnClick}
          text={!isNewMode ? <T id={'edit'} /> : <T id={'save'} />}
        />
        <Popover
          content={
            <Menu>
              <MenuItem
                text={<T id={'save_and_new'} />}
                onClick={handleSubmitAndNewClick}
              />
            </Menu>
          }
          interactionKind={PopoverInteractionKind.CLICK}
          position={Position.BOTTOM_RIGHT}
          minimal
        >
          <Button
            disabled={isSubmitting}
            intent={Intent.PRIMARY}
            rightIcon={<Icon icon="arrow-drop-up-16" iconSize={20} />}
          />
        </Popover>
      </ButtonGroup>
    </FloatingActionsGroup>
  );
}

const FloatingActionsGroup = styled(Group)`
  padding: 10px 0;
  padding-left: 165px;
  border-top: 1px solid #50555a;
  position: sticky;
  bottom: 0;
  background: var(--color-card-background);
  z-index: 1;
`;
