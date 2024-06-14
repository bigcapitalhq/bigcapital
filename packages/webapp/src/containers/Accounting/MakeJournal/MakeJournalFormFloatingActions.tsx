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
import { useHistory } from 'react-router-dom';
import { useFormikContext } from 'formik';
import classNames from 'classnames';
import { Group, Icon, If, FormattedMessage as T } from '@/components';
import { CLASSES } from '@/constants/classes';
import { useMakeJournalFormContext } from './MakeJournalProvider';

/**
 * Make Journal floating actions bar.
 */
export default function MakeJournalFloatingAction() {
  const history = useHistory();

  // Formik context.
  const { submitForm, resetForm, isSubmitting } = useFormikContext();

  // Make journal form context.
  const { setSubmitPayload, manualJournal } = useMakeJournalFormContext();

  // Handle submit & publish button click.
  const handleSubmitPublishBtnClick = (event) => {
    submitForm();
    setSubmitPayload({ redirect: true, publish: true });
  };

  // Handle submit, publish & new button click.
  const handleSubmitPublishAndNewBtnClick = (event) => {
    submitForm();
    setSubmitPayload({ redirect: false, publish: true, resetForm: true });
  };

  // Handle submit, publish & edit button click.
  const handleSubmitPublishContinueEditingBtnClick = (event) => {
    submitForm();
    setSubmitPayload({ redirect: false, publish: true });
  };

  // Handle submit as draft button click.
  const handleSubmitDraftBtnClick = (event) => {
    submitForm();
    setSubmitPayload({ redirect: true, publish: false });
  };

  // Handle submit as draft & new button click.
  const handleSubmitDraftAndNewBtnClick = (event) => {
    submitForm();
    setSubmitPayload({ redirect: false, publish: false, resetForm: true });
  };

  // Handle submit as draft & continue editing button click.
  const handleSubmitDraftContinueEditingBtnClick = (event) => {
    submitForm();
    setSubmitPayload({ redirect: false, publish: false });
  };

  // Handle cancel button click.
  const handleCancelBtnClick = (event) => {
    history.goBack();
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
      {/* ----------- Save And Publish ----------- */}
      <If condition={!manualJournal || !manualJournal?.is_published}>
        <ButtonGroup>
          <Button
            loading={isSubmitting}
            disabled={isSubmitting}
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
              intent={Intent.PRIMARY}
              rightIcon={<Icon icon="arrow-drop-up-16" iconSize={20} />}
              disabled={isSubmitting}
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
              rightIcon={<Icon icon="arrow-drop-up-16" iconSize={20} />}
              disabled={isSubmitting}
            />
          </Popover>
        </ButtonGroup>
      </If>
      {/* ----------- Save and New ----------- */}
      <If condition={manualJournal && manualJournal?.is_published}>
        <ButtonGroup>
          <Button
            loading={isSubmitting}
            disabled={isSubmitting}
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
              intent={Intent.PRIMARY}
              rightIcon={<Icon icon="arrow-drop-up-16" iconSize={20} />}
              disabled={isSubmitting}
            />
          </Popover>
        </ButtonGroup>
      </If>
      {/* ----------- Clear & Reset----------- */}
      <Button
        className={'ml1'}
        disabled={isSubmitting}
        onClick={handleClearBtnClick}
        text={manualJournal ? <T id={'reset'} /> : <T id={'clear'} />}
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
