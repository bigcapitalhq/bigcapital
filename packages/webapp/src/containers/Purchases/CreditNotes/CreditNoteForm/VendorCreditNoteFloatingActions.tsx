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
import { useHistory } from 'react-router-dom';
import { useVendorCreditNoteFormContext } from './VendorCreditNoteFormProvider';
import type { VendorCreditFormValues } from './utils';
import { If, Icon, FormattedMessage as T } from '@/components';
import { PageForm } from '@/components/PageForm';

/**
 * Purchases Credit note floating actions.
 */
export function VendorCreditNoteFloatingActions() {
  const history = useHistory();

  // Formik context.
  const { resetForm, submitForm, isSubmitting } =
    useFormikContext<VendorCreditFormValues>();

  // Credit note form context.
  const { setSubmitPayload, vendorCredit } = useVendorCreditNoteFormContext();

  // Handle submit as open button click.
  const handleSubmitOpenBtnClick = (event: React.MouseEvent<HTMLElement>) => {
    setSubmitPayload({ redirect: true, open: true });
    submitForm();
  };

  // Handle submit, open and another new button click.
  const handleSubmitOpenAndNewBtnClick = (
    event: React.MouseEvent<HTMLElement>,
  ) => {
    setSubmitPayload({ redirect: false, open: true, resetForm: true });
    submitForm();
  };

  // Handle submit as open & continue editing button click.
  const handleSubmitOpenContinueEditingBtnClick = (
    event: React.MouseEvent<HTMLElement>,
  ) => {
    setSubmitPayload({ redirect: false, open: true });
    submitForm();
  };
  // Handle submit as draft button click.
  const handleSubmitDraftBtnClick = (event: React.MouseEvent<HTMLElement>) => {
    setSubmitPayload({ redirect: true, open: false });
    submitForm();
  };

  // handle submit as draft & new button click.
  const handleSubmitDraftAndNewBtnClick = (
    event: React.MouseEvent<HTMLElement>,
  ) => {
    setSubmitPayload({ redirect: false, open: false, resetForm: true });
    submitForm();
  };

  // Handle submit as draft & continue editing button click.
  const handleSubmitDraftContinueEditingBtnClick = (
    event: React.MouseEvent<HTMLElement>,
  ) => {
    setSubmitPayload({ redirect: false, open: false });
    submitForm();
  };

  // Handle cancel button click.
  const handleCancelBtnClick = (event: React.MouseEvent<HTMLElement>) => {
    history.goBack();
  };

  // Handle the clear button click.
  const handleClearBtnClick = (event: React.MouseEvent<HTMLElement>) => {
    resetForm();
  };
  return (
    <PageForm.FooterActions spacing={10}>
      {/* ----------- Save And Open  ----------- */}
      <If condition={!vendorCredit || !vendorCredit?.isOpen}>
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
      <If condition={Boolean(vendorCredit && vendorCredit?.isOpen)}>
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
    </PageForm.FooterActions>
  );
}
