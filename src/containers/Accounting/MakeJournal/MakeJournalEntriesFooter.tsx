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
import classNames from 'classnames';
import { useFormikContext } from 'formik';
import { FormattedMessage as T, If, Icon } from '@/components';
import { CLASSES } from '@/constants/classes';
import { useMakeJournalFormContext } from './MakeJournalProvider';
import { useHistory } from 'react-router-dom';

/**
 * Make Journal floating actions bar.
 */
export default function MakeJournalEntriesFooter() {
  const history = useHistory();

  // Formik context.
  const { isSubmitting, submitForm } = useFormikContext();

  // Make journal form context.
  const {
    manualJournalId,
    setSubmitPayload,
    manualJournalPublished = false,
  } = useMakeJournalFormContext();

  // Handle `submit & publish` button click.
  const handleSubmitPublishBtnClick = (event) => {
    setSubmitPayload({ redirect: true, publish: true });
    submitForm();
  };

  // Handle `submit, publish & new` button click.
  const handleSubmitPublishAndNewBtnClick = (event) => {
    setSubmitPayload({ redirect: false, publish: true, resetForm: true });
    submitForm();
  };

  // Handle `submit, publish & continue editing` button click.
  const handleSubmitPublishContinueEditingBtnClick = (event) => {
    setSubmitPayload({ redirect: false, publish: true });
    submitForm();
  };

  // Handle `submit as draft` button click.
  const handleSubmitDraftBtnClick = (event) => {
    setSubmitPayload({ redirect: true, publish: false });
  };

  // Handle `submit as draft & new` button click.
  const handleSubmitDraftAndNewBtnClick = (event) => {
    setSubmitPayload({ redirect: false, publish: false, resetForm: true });
    submitForm();
  };

  // Handles submit as draft & continue editing button click.
  const handleSubmitDraftContinueEditingBtnClick = (event) => {
    setSubmitPayload({ redirect: false, publish: false });
    submitForm();
  };

  // Handle cancel button action click.
  const handleCancelBtnClick = (event) => {
    history.goBack();
  };

  const handleClearBtnClick = (event) => {};

  return (
    <div className={classNames(CLASSES.PAGE_FORM_FLOATING_ACTIONS)}>
      {/* ----------- Save And Publish ----------- */}
      <If condition={!manualJournalId || !manualJournalPublished}>
        <ButtonGroup>
          <Button
            disabled={isSubmitting}
            intent={Intent.PRIMARY}
            type="submit"
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
            type="submit"
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
      <If condition={manualJournalId && manualJournalPublished}>
        <ButtonGroup>
          <Button
            disabled={isSubmitting}
            intent={Intent.PRIMARY}
            type="submit"
            onClick={handleSubmitPublishBtnClick}
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
        text={manualJournalId ? <T id={'reset'} /> : <T id={'clear'} />}
      />
      {/* ----------- Cancel ----------- */}
      <Button
        className={'ml1'}
        onClick={handleCancelBtnClick}
        text={<T id={'cancel'} />}
      />
    </div>
  );
}
