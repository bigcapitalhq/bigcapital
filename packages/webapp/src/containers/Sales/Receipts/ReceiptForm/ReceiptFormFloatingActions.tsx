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
import { Group, FormattedMessage as T } from '@/components';
import { useFormikContext } from 'formik';
import { useHistory } from 'react-router-dom';
import { CLASSES } from '@/constants/classes';
import { If, Icon } from '@/components';
import { useReceiptFormContext } from './ReceiptFormProvider';

/**
 * Receipt floating actions bar.
 */
export default function ReceiptFormFloatingActions() {
  // History context.
  const history = useHistory();

  // Formik context.
  const { resetForm, submitForm, isSubmitting } = useFormikContext();

  // Receipt form context.
  const { receipt, setSubmitPayload } = useReceiptFormContext();

  // Handle submit & close button click.
  const handleSubmitCloseBtnClick = (event) => {
    setSubmitPayload({ redirect: true, status: true });
    submitForm();
  };

  // Handle submit, close & new button click.
  const handleSubmitCloseAndNewBtnClick = (event) => {
    setSubmitPayload({ redirect: false, status: true, resetForm: true });
    submitForm();
  };

  // Handle submit, close & continue editing button click.
  const handleSubmitCloseContinueEditingBtnClick = (event) => {
    setSubmitPayload({ redirect: false, status: true });
    submitForm();
  };

  // Handle submit & draft button click.
  const handleSubmitDraftBtnClick = (event) => {
    setSubmitPayload({ redirect: true, status: false });
    submitForm();
  };

  // Handle submit, draft & new button click.
  const handleSubmitDraftAndNewBtnClick = (event) => {
    setSubmitPayload({ redirect: false, status: false, resetForm: true });
    submitForm();
  };

  const handleSubmitDraftContinueEditingBtnClick = (event) => {
    setSubmitPayload({ redirect: false, status: false });
    submitForm();
  };

  // Handle cancel button click.
  const handleCancelBtnClick = (event) => {
    history.goBack();
  };

  // Handle the clear button click.
  const handleClearBtnClick = (event) => {
    resetForm();
  };

  return (
    <Group
      spacing={10}
      className={classNames(CLASSES.PAGE_FORM_FLOATING_ACTIONS)}
    >
      {/* ----------- Save And Close ----------- */}
      <If condition={!receipt || !receipt?.is_closed}>
        <ButtonGroup>
          <Button
            disabled={isSubmitting}
            loading={isSubmitting}
            intent={Intent.PRIMARY}
            onClick={handleSubmitCloseBtnClick}
            text={<T id={'save_close'} />}
          />
          <Popover
            content={
              <Menu>
                <MenuItem
                  text={<T id={'close_and_new'} />}
                  onClick={handleSubmitCloseAndNewBtnClick}
                />
                <MenuItem
                  text={<T id={'close_continue_editing'} />}
                  onClick={handleSubmitCloseContinueEditingBtnClick}
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
        {/* ----------- Save As Draft ----------- */}
        <ButtonGroup>
          <Button
            disabled={isSubmitting}
            className={'ml1'}
            onClick={handleSubmitDraftBtnClick}
            text={<T id={'save_as_draft'} />}
          />
          <Popover
            content={
              <Menu>
                <MenuItem
                  text={<T id={'save_and_new'} />}
                  onClick={handleSubmitDraftAndNewBtnClick}
                />
                <MenuItem
                  text={<T id={'save_continue_editing'} />}
                  onClick={handleSubmitDraftContinueEditingBtnClick}
                />
              </Menu>
            }
            minimal={true}
            interactionKind={PopoverInteractionKind.CLICK}
            position={Position.BOTTOM_LEFT}
          >
            <Button
              disabled={isSubmitting}
              rightIcon={<Icon icon="arrow-drop-up-16" iconSize={20} />}
            />
          </Popover>
        </ButtonGroup>
      </If>
      {/* ----------- Save and New ----------- */}
      <If condition={receipt && receipt?.is_closed}>
        <ButtonGroup>
          <Button
            disabled={isSubmitting}
            intent={Intent.PRIMARY}
            onClick={handleSubmitCloseBtnClick}
            style={{ minWidth: '85px' }}
            text={<T id={'save'} />}
          />
          <Popover
            content={
              <Menu>
                <MenuItem
                  text={<T id={'save_and_new'} />}
                  onClick={handleSubmitCloseAndNewBtnClick}
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
      </If>
      {/* ----------- Clear & Reset----------- */}
      <Button
        className={'ml1'}
        disabled={isSubmitting}
        onClick={handleClearBtnClick}
        text={receipt ? <T id={'reset'} /> : <T id={'clear'} />}
      />
      {/* ----------- Cancel ----------- */}
      <Button
        className={'ml1'}
        onClick={handleCancelBtnClick}
        text={<T id={'cancel'} />}
      />
    </Group>
  );
}
