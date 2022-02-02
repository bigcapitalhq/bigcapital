import React from 'react';
import { useHistory } from 'react-router-dom';
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
import { FormattedMessage as T } from 'components';
import classNames from 'classnames';
import { useFormikContext } from 'formik';
import { CLASSES } from 'common/classes';

import { Icon } from 'components';
import { useWarehouseTransferFormContext } from './WarehouseTransferFormProvider';

/**
 * Warehouse transfer floating actions bar.
 */
export default function WarehouseTransferFloatingActions() {
  // History context.
  const history = useHistory();

  // Formik form context.
  const { isSubmitting, submitForm, resetForm, values, errors } =
    useFormikContext();

  // Warehouse tansfer form context.
  const { isNewMode, setSubmitPayload } = useWarehouseTransferFormContext();

  // Handle submit button click.
  const handleSubmitBtnClick = (event) => {
    setSubmitPayload({ redirect: true });
    submitForm();
  };

  // Handle clear button click.
  const handleClearBtnClick = (event) => {
    resetForm();
  };

  // Handle submit & new button click.
  const handleSubmitAndNewClick = (event) => {
    setSubmitPayload({ redirect: false, resetForm: true });
    submitForm();
  };

  // Handle cancel button click.
  const handleCancelBtnClick = (event) => {
    history.goBack();
  };

  return (
    <div className={classNames(CLASSES.PAGE_FORM_FLOATING_ACTIONS)}>
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
                // onClick={handleSubmitContinueEditingBtnClick}
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
    </div>
  );
}
