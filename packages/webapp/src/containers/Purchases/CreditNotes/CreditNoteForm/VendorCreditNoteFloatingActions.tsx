// @ts-nocheck
import React from 'react';
import classNames from 'classnames';
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
import { If, Icon, FormattedMessage as T } from '@/components';
import { CLASSES } from '@/constants/classes';
import { useVendorCreditNoteFormContext } from './VendorCreditNoteFormProvider';

/**
 * Purchases Credit note floating actions.
 */
export default function VendorCreditNoteFloatingActions() {
  const history = useHistory();

  // Formik context.
  const { resetForm, submitForm, isSubmitting } = useFormikContext();

  // Credit note form context.
  const { setSubmitPayload, vendorCredit } = useVendorCreditNoteFormContext();

  // Handle submit as open button click.
  const handleSubmitOpenBtnClick = (event) => {
    setSubmitPayload({ redirect: true, open: true });
    submitForm();
  };

  // Handle submit, open and another new button click.
  const handleSubmitOpenAndNewBtnClick = (event) => {
    setSubmitPayload({ redirect: false, open: true, resetForm: true });
    submitForm();
  };

  // Handle submit as open & continue editing button click.
  const handleSubmitOpenContinueEditingBtnClick = (event) => {
    setSubmitPayload({ redirect: false, open: true });
    submitForm();
  };
  // Handle submit as draft button click.
  const handleSubmitDraftBtnClick = (event) => {
    setSubmitPayload({ redirect: true, open: false });
    submitForm();
  };

  // handle submit as draft & new button click.
  const handleSubmitDraftAndNewBtnClick = (event) => {
    setSubmitPayload({ redirect: false, open: false, resetForm: true });
    submitForm();
  };

  // Handle submit as draft & continue editing button click.
  const handleSubmitDraftContinueEditingBtnClick = (event) => {
    setSubmitPayload({ redirect: false, open: false });
    submitForm();
  };

  // Handle cancel button click.
  const handleCancelBtnClick = (event) => {
    history.goBack();
  };

  const handleClearBtnClick = (event) => {
    resetForm();
  };
  return (
    <div className={classNames(CLASSES.PAGE_FORM_FLOATING_ACTIONS)}>
      {/* ----------- Save And Open  ----------- */}
      <If condition={!vendorCredit || !vendorCredit?.is_open}>
        <ButtonGroup>
          <Button
            disabled={isSubmitting}
            loading={isSubmitting}
            intent={Intent.PRIMARY}
            onClick={handleSubmitOpenBtnClick}
            text={<T id={'save_open'} />}
          />
          <Popover
            content={
              <Menu>
                <MenuItem
                  text={<T id={'open_and_new'} />}
                  onClick={handleSubmitOpenAndNewBtnClick}
                />
                <MenuItem
                  text={<T id={'open_continue_editing'} />}
                  onClick={handleSubmitOpenContinueEditingBtnClick}
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
      <If condition={vendorCredit && vendorCredit?.is_open}>
        <ButtonGroup>
          <Button
            loading={isSubmitting}
            intent={Intent.PRIMARY}
            onClick={handleSubmitOpenBtnClick}
            style={{ minWidth: '85px' }}
            text={<T id={'save'} />}
          />
          <Popover
            content={
              <Menu>
                <MenuItem
                  text={<T id={'save_and_new'} />}
                  onClick={handleSubmitOpenAndNewBtnClick}
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
        text={vendorCredit ? <T id={'reset'} /> : <T id={'clear'} />}
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
