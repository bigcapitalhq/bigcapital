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
import { useWarehouseTransferFormContext } from './WarehouseTransferFormProvider';
import type { WarehouseTransferSubmitPayload } from './types';
import { If, Icon, FormattedMessage as T, Group } from '@/components';
import { CLASSES } from '@/constants/classes';

/**
 * Warehouse transfer floating actions bar.
 */
export function WarehouseTransferFloatingActions() {
  // History context.
  const history = useHistory();

  // Formik form context.
  const { isSubmitting, submitForm, resetForm } = useFormikContext();

  // Warehouse tansfer form context.
  const { warehouseTransfer, setSubmitPayload } =
    useWarehouseTransferFormContext();

  // Handle submit initiate button click.
  const handleSubmitInitiateBtnClick = () => {
    setSubmitPayload({ redirect: true, initiate: true, deliver: false });
  };

  // Handle submit transferred button click.
  const handleSubmitTransferredBtnClick = () => {
    setSubmitPayload({ redirect: true, initiate: true, deliver: true });
    submitForm();
  };

  // Handle submit as draft button click.
  const handleSubmitDraftBtnClick = () => {
    setSubmitPayload({ redirect: true, initiate: false, deliver: false });
    submitForm();
  };
  // Handle submit as draft & new button click.
  const handleSubmitDraftAndNewBtnClick = () => {
    setSubmitPayload({
      redirect: false,
      initiate: false,
      deliver: false,
      resetForm: true,
    } satisfies WarehouseTransferSubmitPayload);
    submitForm();
  };

  // Handle submit as draft & continue editing button click.
  const handleSubmitDraftContinueEditingBtnClick = () => {
    setSubmitPayload({ redirect: false, deliver: false, initiate: false });
    submitForm();
  };

  // Handle clear button click.
  const handleClearBtnClick = () => {
    resetForm();
  };

  // Handle cancel button click.
  const handleCancelBtnClick = () => {
    history.goBack();
  };

  return (
    <div className={classNames(CLASSES.PAGE_FORM_FLOATING_ACTIONS)}>
      <Group spacing={10}>
        {/* ----------- Save Intitate & transferred ----------- */}
        <If condition={!warehouseTransfer || !warehouseTransfer?.isTransferred}>
          <ButtonGroup>
            <Button
              disabled={isSubmitting}
              loading={isSubmitting}
              intent={Intent.PRIMARY}
              type="submit"
              onClick={handleSubmitInitiateBtnClick}
              style={{ minWidth: '85px' }}
              text={<T id={'warehouse_transfer.save_initiate_transfer'} />}
            />
            <Popover
              content={
                <Menu>
                  <MenuItem
                    text={
                      <T id={'warehouse_transfer.save_mark_as_transferred'} />
                    }
                    onClick={handleSubmitTransferredBtnClick}
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
        <If
          condition={Boolean(
            warehouseTransfer && warehouseTransfer?.isTransferred,
          )}
        >
          <Button
            disabled={isSubmitting}
            loading={isSubmitting}
            intent={Intent.PRIMARY}
            onClick={handleSubmitTransferredBtnClick}
            style={{ minWidth: '100px' }}
            text={<T id={'save'} />}
          />
        </If>

        {/* ----------- Clear & Reset----------- */}
        <Button
          className={'ml1'}
          disabled={isSubmitting}
          onClick={handleClearBtnClick}
          text={warehouseTransfer ? <T id={'reset'} /> : <T id={'clear'} />}
        />

        {/* ----------- Cancel  ----------- */}
        <Button
          className={'ml1'}
          disabled={isSubmitting}
          onClick={handleCancelBtnClick}
          text={<T id={'cancel'} />}
        />
      </Group>
    </div>
  );
}
