// @ts-nocheck
import React from 'react';
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
import styled from 'styled-components';
import classNames from 'classnames';
import { useFormikContext } from 'formik';

import { Group, Icon, FormattedMessage as T } from '@/components';
import { CLASSES } from '@/constants/classes';
import { useVendorFormContext } from './VendorFormProvider';
import { safeInvoke } from '@/utils';

/**
 * Vendor floating actions bar.
 */
export default function VendorFloatingActions({ onCancel }) {
  // Formik context.
  const { resetForm, isSubmitting, submitForm } = useFormikContext();

  // Vendor form context.
  const { isNewMode, setSubmitPayload } = useVendorFormContext();

  // Handle the submit button.
  const handleSubmitBtnClick = (event) => {
    setSubmitPayload({ noRedirect: false });
  };

  // Handle the submit & new button click.
  const handleSubmitAndNewClick = (event) => {
    submitForm();
    setSubmitPayload({ noRedirect: true });
  };

  // Handle cancel button click.
  const handleCancelBtnClick = (event) => {
    safeInvoke(onCancel, event);
  };

  // Handle clear button click.
  const handleClearBtnClick = (event) => {
    resetForm();
  };

  return (
    <Group
      spacing={10}
      className={classNames(CLASSES.PAGE_FORM_FLOATING_ACTIONS)}
    >
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
        disabled={isSubmitting}
        onClick={handleCancelBtnClick}
        text={<T id={'cancel'} />}
      />
    </Group>
  );
}

const SaveButton = styled(Button)`
  min-width: 100px;
`;
