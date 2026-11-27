import {
  Button,
  ButtonGroup,
  Intent,
  Menu,
  MenuItem,
  Popover,
  PopoverInteractionKind,
  Position,
} from '@blueprintjs/core';
import classNames from 'classnames';
import { useFormikContext } from 'formik';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { useBudgetFormContext } from './BudgetFormProvider';
import type { BudgetFormValues } from './types';
import { FormattedMessage as T, Group, Icon } from '@/components';
import { CLASSES } from '@/constants/classes';

/**
 * Budget form floating actions.
 */
export function BudgetFormFloatingActions() {
  const history = useHistory();
  const { isSubmitting, submitForm, resetForm } =
    useFormikContext<BudgetFormValues>();
  const { isNewMode, setSubmitPayload } = useBudgetFormContext();

  // Handle the save button click.
  const handleSubmitClick = () => {
    setSubmitPayload({ redirect: true });
  };

  // Handle the save and new button click.
  const handleSubmitAndNewClick = () => {
    setSubmitPayload({ redirect: false });
    submitForm();
  };

  // Handle the reset button click.
  const handleResetClick = () => {
    resetForm();
  };

  // Handle the cancel button click.
  const handleCancelClick = () => {
    history.goBack();
  };

  return (
    <div className={classNames(CLASSES.PAGE_FORM_FLOATING_ACTIONS)}>
      <Group spacing={10}>
        <ButtonGroup>
          <Button
            disabled={isSubmitting}
            loading={isSubmitting}
            intent={Intent.PRIMARY}
            type={'submit'}
            onClick={handleSubmitClick}
            text={isNewMode ? <T id={'save'} /> : <T id={'edit'} />}
            style={{ minWidth: '90px' }}
          />
          <Popover
            content={
              <Menu>
                <MenuItem
                  text={<T id={'save_and_new'} />}
                  onClick={handleSubmitAndNewClick}
                />
              </Menu>
            }
            interactionKind={PopoverInteractionKind.CLICK}
            position={Position.BOTTOM_LEFT}
            minimal={true}
          >
            <Button
              disabled={isSubmitting}
              intent={Intent.PRIMARY}
              rightIcon={<Icon icon={'arrow-drop-up-16'} iconSize={20} />}
            />
          </Popover>
        </ButtonGroup>

        <Button
          disabled={isSubmitting}
          onClick={handleResetClick}
          text={<T id={isNewMode ? 'clear' : 'reset'} />}
        />

        <Button
          disabled={isSubmitting}
          onClick={handleCancelClick}
          text={<T id={'cancel'} />}
        />
      </Group>
    </div>
  );
}
