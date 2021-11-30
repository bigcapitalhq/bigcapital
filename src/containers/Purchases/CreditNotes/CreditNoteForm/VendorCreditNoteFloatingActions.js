import React from 'react';
import { useHistory } from 'react-router-dom';
import { useFormikContext } from 'formik';
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
import { If, Icon, FormattedMessage as T } from 'components';
import { CLASSES } from 'common/classes';
import classNames from 'classnames';
import { useVendorCreditNoteFormContext } from './VendorCreditNoteFormProvider';

/**
 * Purchases Credit note floating actions.
 */
export default function VendorCreditNoteFloatingActions() {
  const history = useHistory();

  // Formik context.
  const { resetForm, submitForm, isSubmitting } = useFormikContext();

  // Credit note form context.
  const { setSubmitPayload, isNewMode } = useVendorCreditNoteFormContext();

  // Handle submit, save and anothe new button click.
  const handleSubmitAndNewBtnClick = (event) => {
    setSubmitPayload({ redirect: false, status: true, resetForm: true });
    submitForm();
  };

  // Handle submit as save & continue editing button click.
  const handleSubmitSaveContinueEditingBtnClick = (event) => {
    setSubmitPayload({ redirect: false, status: true });
    submitForm();
  };

  // Handle submit as draft button click.
  const handleSubmitDraftBtnClick = (event) => {
    setSubmitPayload({ redirect: true, status: false });
    submitForm();
  };

  // handle submit as draft & new button click.
  const handleSubmitDraftAndNewBtnClick = (event) => {
    setSubmitPayload({ redirect: false, status: false, resetForm: true });
    submitForm();
  };

  // Handle submit as draft & continue editing button click.
  const handleSubmitDraftContinueEditingBtnClick = (event) => {
    setSubmitPayload({ redirect: false, status: false });
    submitForm();
  };

  // Handle cancel button click.
  const handleCancelBtnClick = (event) => {
    history.goBack();
  };

  // Handle submit button click.
  const handleSubmitBtnClick = (event) => {
    setSubmitPayload({ redirect: true });
  };

  const handleClearBtnClick = (event) => {
    resetForm();
  };

  return (
    <div className={classNames(CLASSES.PAGE_FORM_FLOATING_ACTIONS)}>
      {/* ----------- Save  ----------- */}
      <ButtonGroup>
        <Button
          disabled={isSubmitting}
          loading={isSubmitting}
          intent={Intent.PRIMARY}
          text={<T id={'save'} />}
        />

        <Popover
          content={
            <Menu>
              <MenuItem
                text={<T id={'save_and_new'} />}
                onClick={handleSubmitAndNewBtnClick}
              />
              <MenuItem
                text={<T id={'save_continue_editing'} />}
                onClick={handleSubmitSaveContinueEditingBtnClick}
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
      {/* ----------- Clear & Reset----------- */}
      <Button
        className={'ml1'}
        disabled={isSubmitting}
        onClick={handleClearBtnClick}
        text={isNewMode ? <T id={'reset'} /> : <T id={'clear'} />}
      />
      {/* ----------- Cancel ----------- */}
      <Button
        className={'ml1'}
        disabled={isSubmitting}
        onClick={handleCancelBtnClick}
        text={<T id={'cancel'} />}
      />
    </div>
  );
}
