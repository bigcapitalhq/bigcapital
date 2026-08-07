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
import { useExpenseFormContext } from './ExpenseFormPageProvider';
import type { ExpenseFormValues } from './types';
import { FormattedMessage as T, PageForm, Group } from '@/components';
import { Icon, If } from '@/components';

/**
 * Expense form floating actions.
 */
export function ExpenseFloatingFooter() {
  const history = useHistory();

  const { isSubmitting, submitForm, resetForm } =
    useFormikContext<ExpenseFormValues>();

  const { setSubmitPayload, isNewMode } = useExpenseFormContext();

  const handleSubmitPublishBtnClick = (_event: React.MouseEvent) => {
    setSubmitPayload({ redirect: true, publish: true });
    submitForm();
  };

  const handleSubmitPublishAndNewBtnClick = (_event: React.MouseEvent) => {
    setSubmitPayload({ redirect: false, publish: true, resetForm: true });
    submitForm();
  };

  const handleSubmitPublishContinueEditingBtnClick = (
    _event: React.MouseEvent,
  ) => {
    setSubmitPayload({ redirect: false, publish: true });
    submitForm();
  };

  const handleSubmitDraftBtnClick = (_event: React.MouseEvent) => {
    setSubmitPayload({ redirect: true, publish: false });
    submitForm();
  };

  const handleSubmitDraftAndNewBtnClick = (_event: React.MouseEvent) => {
    setSubmitPayload({ redirect: false, publish: false, resetForm: true });
    submitForm();
  };

  const handleSubmitDraftContinueEditingBtnClick = (
    _event: React.MouseEvent,
  ) => {
    setSubmitPayload({ redirect: false, publish: false });
    submitForm();
  };

  const handleCancelBtnClick = (_event: React.MouseEvent) => {
    history.goBack();
  };

  const handleClearBtnClick = (_event: React.MouseEvent) => {
    resetForm();
  };

  return (
    <PageForm.FooterActions spacing={10} position="apart">
      <Group spacing={10}>
        {/* ----------- Save And Publish ----------- */}
        <If condition={isNewMode}>
          <ButtonGroup>
            <Button
              disabled={isSubmitting}
              loading={isSubmitting}
              intent={Intent.PRIMARY}
              onClick={handleSubmitPublishBtnClick}
              text={<T id={'save_publish'} />}
            />
            <Popover
              content={
                <Menu>
                  <MenuItem
                    text={<T id={'publish_and_new'} />}
                    onClick={handleSubmitPublishAndNewBtnClick}
                  />
                  <MenuItem
                    text={<T id={'publish_continue_editing'} />}
                    onClick={handleSubmitPublishContinueEditingBtnClick}
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
        <If condition={!isNewMode}>
          <ButtonGroup>
            <Button
              disabled={isSubmitting}
              loading={isSubmitting}
              intent={Intent.PRIMARY}
              onClick={handleSubmitPublishBtnClick}
              style={{ minWidth: '85px' }}
              text={<T id={'save'} />}
            />
            <Popover
              content={
                <Menu>
                  <MenuItem
                    text={<T id={'save_and_new'} />}
                    onClick={handleSubmitPublishAndNewBtnClick}
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
          text={!isNewMode ? <T id={'reset'} /> : <T id={'clear'} />}
        />
        {/* ----------- Cancel ----------- */}
        <Button
          className={'ml1'}
          onClick={handleCancelBtnClick}
          text={<T id={'cancel'} />}
        />
      </Group>
    </PageForm.FooterActions>
  );
}
