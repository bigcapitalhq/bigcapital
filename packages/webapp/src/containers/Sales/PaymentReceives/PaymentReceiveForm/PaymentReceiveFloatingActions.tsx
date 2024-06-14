// @ts-nocheck
import React from 'react';
import classNames from 'classnames';
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
import { useHistory } from 'react-router-dom';
import { Group, Icon, FormattedMessage as T } from '@/components';
import { useFormikContext } from 'formik';
import { usePaymentReceiveFormContext } from './PaymentReceiveFormProvider';
import { CLASSES } from '@/constants/classes';

/**
 * Payment receive floating actions bar.
 */
export default function PaymentReceiveFormFloatingActions() {
  // Payment receive form context.
  const { setSubmitPayload, isNewMode } = usePaymentReceiveFormContext();

  // Formik form context.
  const { isSubmitting, submitForm, resetForm } = useFormikContext();

  // History context.
  const history = useHistory();

  // Handle submit button click.
  const handleSubmitBtnClick = (event) => {
    setSubmitPayload({ redirect: true });
  };
  // Handle clear button click.
  const handleClearBtnClick = (event) => {
    resetForm();
  };
  // Handle cancel button click.
  const handleCancelBtnClick = (event) => {
    history.goBack();
  };
  // Handle submit & new button click.
  const handleSubmitAndNewClick = (event) => {
    setSubmitPayload({ redirect: false, resetForm: true });
    submitForm();
  };
  // Handle submit & continue editing button click.
  const handleSubmitContinueEditingBtnClick = (event) => {
    setSubmitPayload({ redirect: false, publish: true });
    submitForm();
  };

  return (
    <Group
      spacing={10}
      className={classNames(CLASSES.PAGE_FORM_FLOATING_ACTIONS)}
    >
      {/* ----------- Save and New ----------- */}
      <ButtonGroup>
        <Button
          disabled={isSubmitting}
          loading={isSubmitting}
          intent={Intent.PRIMARY}
          type="submit"
          onClick={handleSubmitBtnClick}
          style={{ minWidth: '85px' }}
          text={!isNewMode ? <T id={'edit'} /> : <T id={'save'} />}
        />
        <Popover
          content={
            <Menu>
              <MenuItem
                text={<T id={'save_and_new'} />}
                onClick={handleSubmitAndNewClick}
              />
              <MenuItem
                text={<T id={'save_continue_editing'} />}
                onClick={handleSubmitContinueEditingBtnClick}
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
