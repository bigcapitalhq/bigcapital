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
import { useCreditNoteFormContext } from './CreditNoteFormProvider';

/**
 * Credit note floating actions.
 */
export default function CreditNoteFloatingActions() {
  const history = useHistory();

  // Formik context.
  const { resetForm, submitForm, isSubmitting } = useFormikContext();

  // Credit note form context.
  const { setSubmitPayload } = useCreditNoteFormContext();

  // Handle cancel button click.
  const handleCancelBtnClick = (event) => {
    history.goBack();
  };

  const handleClearBtnClick = (event) => {
    resetForm();
  };

  return (
    <div className={classNames(CLASSES.PAGE_FORM_FLOATING_ACTIONS)}>
      {/* ----------- Save And Deliver ----------- */}
      <ButtonGroup>
        <Button
          disabled={isSubmitting}
          loading={isSubmitting}
          intent={Intent.PRIMARY}
          text={<T id={'save_and_deliver'} />}
        />
        <Popover
          content={
            <Menu>
              <MenuItem text={<T id={'deliver_and_new'} />} />
              <MenuItem text={<T id={'deliver_continue_editing'} />} />
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
          text={<T id={'save_as_draft'} />}
        />
        <Popover
          content={
            <Menu>
              <MenuItem text={<T id={'save_and_new'} />} />
              <MenuItem text={<T id={'save_continue_editing'} />} />
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
      {/* ----------- Save and New ----------- */}

      {/* ----------- Clear & Reset----------- */}
      <Button
        className={'ml1'}
        disabled={isSubmitting}
        onClick={handleClearBtnClick}
        // text={ ? <T id={'reset'} /> : <T id={'clear'} />}
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
