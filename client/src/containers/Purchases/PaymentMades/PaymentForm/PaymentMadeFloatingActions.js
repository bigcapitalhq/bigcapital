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
import { FormattedMessage as T } from 'react-intl';
import { useHistory } from 'react-router-dom';
import classNames from 'classnames';
import { useFormikContext } from 'formik';
import { usePaymentMadeFormContext } from './PaymentMadeFormProvider';

import { CLASSES } from 'common/classes';
import { Icon } from 'components';

/**
 * Payment made floating actions bar.
 */
export default function PaymentMadeFloatingActions() {
  // History context.
  const history = useHistory();

  // Formik context.
  const { isSubmitting, resetForm } = useFormikContext();

  // Payment made form context.
  const { setSubmitPayload, paymentMadeId } = usePaymentMadeFormContext();

  // Handle submit button click.
  const handleSubmitBtnClick = (event) => {
    setSubmitPayload({ redirect: true });
  };

  // Handle clear button click.
  const handleClearBtnClick = (event) => {
    resetForm();
  };

  // Handle cancel button click.
  const handleCancelBtnClick = (event) => {
    history.goBack();
  };

  // Handle submit & new button click.
  const handleSubmitAndNewClick = (event) => {
    setSubmitPayload({ redirect: false, resetForm: true });
  };

  // handle submit & continue editing button click.
  const handleSubmitContinueEditingBtnClick = (event) => {
    setSubmitPayload({ redirect: false, publish: true });
  };
  return (
    <div className={classNames(CLASSES.PAGE_FORM_FLOATING_ACTIONS)}>
      {/* ----------- Save and New ----------- */}
      <ButtonGroup>
        <Button
          disabled={isSubmitting}
          intent={Intent.PRIMARY}
          type="submit"
          onClick={handleSubmitBtnClick}
          text={paymentMadeId ? <T id={'edit'} /> : <T id={'save'} />}
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
                onClick={handleSubmitContinueEditingBtnClick}
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
        text={paymentMadeId ? <T id={'reset'} /> : <T id={'clear'} />}
      />
      {/* ----------- Cancel  ----------- */}
      <Button
        className={'ml1'}
        onClick={handleCancelBtnClick}
        text={<T id={'cancel'} />}
      />
    </div>
  );
}
