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
import React from 'react';
import { useHistory } from 'react-router-dom';
import { usePaymentMadeFormContext } from './PaymentMadeFormProvider';
import type { PaymentMadeFormValues } from './utils';
import { Group, Icon, FormattedMessage as T } from '@/components';
import { PageForm } from '@/components/PageForm';
import { CLASSES } from '@/constants/classes';

/**
 * Payment made floating actions bar.
 */
export function PaymentMadeFloatingActions() {
  // History context.
  const history = useHistory();

  // Formik context.
  const { isSubmitting, resetForm, submitForm } =
    useFormikContext<PaymentMadeFormValues>();

  // Payment made form context.
  const { setSubmitPayload, paymentMadeId } = usePaymentMadeFormContext();

  // Handle submit button click.
  const handleSubmitBtnClick = () => {
    setSubmitPayload({ redirect: true });
  };

  // Handle clear button click.
  const handleClearBtnClick = () => {
    resetForm();
  };

  // Handle cancel button click.
  const handleCancelBtnClick = () => {
    history.goBack();
  };

  // Handle submit & new button click.
  const handleSubmitAndNewClick = () => {
    setSubmitPayload({ redirect: false, resetForm: true });
    submitForm();
  };

  // Handle submit & continue editing button click.
  const handleSubmitContinueEditingBtnClick = () => {
    setSubmitPayload({ redirect: false, publish: true });
    submitForm();
  };

  return (
    <PageForm.FooterActions
      spacing={10}
      className={classNames(CLASSES.PAGE_FORM_FLOATING_ACTIONS)}
    >
      {/* ----------- Save and New ----------- */}
      <ButtonGroup>
        <Button
          loading={isSubmitting}
          intent={Intent.PRIMARY}
          type="submit"
          onClick={handleSubmitBtnClick}
          style={{ minWidth: '85px' }}
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
        disabled={isSubmitting}
        onClick={handleCancelBtnClick}
        text={<T id={'cancel'} />}
      />
    </PageForm.FooterActions>
  );
}
