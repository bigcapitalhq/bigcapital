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
import { useFormikContext } from 'formik';
import { FormattedMessage as T } from 'react-intl';
import { CLASSES } from 'common/classes';
import classNames from 'classnames';
import { saveInvoke } from 'utils';
import { Icon } from 'components';

/**
 * Expense form floating actions.
 */
export default function ExpenseFloatingFooter({
  isSubmitting,
  onSubmitClick,
  onCancelClick,
  onDraftClick,
  onClearClick,
  onSubmitAndNewClick,
  onSubmitForm,
  onResetForm,
  expense,
}) {
  const handleSubmitPublishAndNewBtnClick = (event) => {
    onSubmitForm();
    saveInvoke(onSubmitClick, event, {
      redirect: false,
      publish: true,
      resetForm: true,
    });
  };

  const handleSubmitPublishContinueEditingBtnClick = (event) => {
    onSubmitForm();
    saveInvoke(onSubmitClick, event, {
      redirect: false,
      publish: true,
    });
  };

  const handleSubmitDraftAndNewBtnClick = (event) => {
    onSubmitForm();
    saveInvoke(onSubmitClick, event, {
      redirect: false,
      publish: false,
      resetForm: true,
    });
  };

  const handleSubmitDraftContinueEditingBtnClick = (event) => {
    onSubmitForm();
    saveInvoke(onSubmitClick, event, {
      redirect: false,
      publish: true,
    });
  };

  return (
    <div className={classNames(CLASSES.PAGE_FORM_FLOATING_ACTIONS)}>
      <ButtonGroup>
        {/* ----------- Save And Publish ----------- */}
        <Button
          disabled={isSubmitting}
          intent={Intent.PRIMARY}
          type="submit"
          onClick={(event) => {
            saveInvoke(onSubmitClick, event, {
              redirect: true,
              publish: true,
            });
          }}
          text={
            expense && expense.id ? (
              <T id={'edit'} />
            ) : (
              <T id={'save_publish'} />
            )
          }
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
          />
        </Popover>

        {/* ----------- Save As Draft ----------- */}
        <Button
          disabled={isSubmitting}
          className={'ml1'}
          type="submit"
          onClick={(event) => {
            saveInvoke(onSubmitClick, event, {
              redirect: true,
              publish: false,
            });
          }}
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
          <Button rightIcon={<Icon icon="arrow-drop-up-16" iconSize={20} />} />
        </Popover>

        {/* ----------- Clear ----------- */}
        <Button
          className={'ml1'}
          disabled={isSubmitting}
          onClick={(event) => {
            onResetForm();
            saveInvoke(onClearClick, event);
          }}
          text={expense && expense.id ? <T id={'reset'} /> : <T id={'clear'} />}
        />
        {/* ----------- Cancel ----------- */}
        <Button
          className={'ml1'}
          onClick={(event) => {
            saveInvoke(onCancelClick, event);
          }}
          text={<T id={'cancel'} />}
        />
      </ButtonGroup>
    </div>
  );
}
