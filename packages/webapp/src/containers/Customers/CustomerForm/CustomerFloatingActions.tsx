// @ts-nocheck
import React from 'react';
import styled from 'styled-components';
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
import classNames from 'classnames';
import { useFormikContext } from 'formik';
import { Icon, FormattedMessage as T } from '@/components';
import { CLASSES } from '@/constants/classes';
import { useCustomerFormContext } from './CustomerFormProvider';
import { safeInvoke } from '@/utils';


/**
 * Customer floating actions bar.
 */
export default function CustomerFloatingActions({ onCancel }) {
  // Customer form context.
  const { isNewMode, setSubmitPayload } = useCustomerFormContext();

  // Formik context.
  const { resetForm, submitForm, isSubmitting } = useFormikContext();

  // Handle submit button click.
  const handleSubmitBtnClick = (event) => {
    setSubmitPayload({ noRedirect: false });
  };

  // Handle cancel button click.
  const handleCancelBtnClick = (event) => {
    safeInvoke(onCancel, event);
  };

  // handle clear button click.
  const handleClearBtnClick = (event) => {
    resetForm();
  };

  // Handle submit & new button click.
  const handleSubmitAndNewClick = (event) => {
    submitForm();
    setSubmitPayload({ noRedirect: true });
  };

  return (
    <div className={classNames(CLASSES.PAGE_FORM_FLOATING_ACTIONS)}>
      <ButtonGroup>
        {/* ----------- Save and New ----------- */}
        <SaveButton
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
          minimal={true}
          interactionKind={PopoverInteractionKind.CLICK}
          position={Position.BOTTOM_LEFT}
        >
          <Button
            disabled={isSubmitting}
            intent={Intent.PRIMARY}
            rightIcon={<Icon icon="arrow-drop-up-16" iconSize={20} />}
          />
        </Popover>
      </ButtonGroup>

      {/* ----------- Clear & Reset----------- */}
      <Button
        className={'ml1'}
        disabled={isSubmitting}
        onClick={handleClearBtnClick}
        text={!isNewMode ? <T id={'reset'} /> : <T id={'clear'} />}
      />
      {/* ----------- Cancel  ----------- */}
      <Button
        className={'ml1'}
        onClick={handleCancelBtnClick}
        text={<T id={'cancel'} />}
      />
    </div>
  );
}

const SaveButton = styled(Button)`
  min-width: 100px;
`;
