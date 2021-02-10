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
import classNames from 'classnames';
import { CLASSES } from 'common/classes';
import { useFormikContext } from 'formik';
import { useHistory } from 'react-router-dom';
import { Icon } from 'components';
import { useVendorFormContext } from './VendorFormProvider';

/**
 * Vendor floating actions bar.
 */
export default function VendorFloatingActions() {
  // Formik context.
  const { resetForm, isSubmitting, submitForm } = useFormikContext();

  // Vendor form context.
  const { vendor, setSubmitPayload } = useVendorFormContext();

  // History.
  const history = useHistory();

  // Handle the submit button.
  const handleSubmitBtnClick = (event) => {
    setSubmitPayload({ noRedirect: false, });
    submitForm();
  };

  // Handle the submit & new button click.
  const handleSubmitAndNewClick = (event) => {
    submitForm();
    setSubmitPayload({ noRedirect: true, });
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
    <div className={classNames(CLASSES.PAGE_FORM_FLOATING_ACTIONS)}>
      <ButtonGroup>
        {/* ----------- Save and New ----------- */}
        <Button
          disabled={isSubmitting}
          loading={isSubmitting}
          intent={Intent.PRIMARY}
          type="submit"
          onClick={handleSubmitBtnClick}
          text={vendor ? <T id={'edit'} /> : <T id={'save'} />}
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
        text={vendor ? <T id={'reset'} /> : <T id={'clear'} />}
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
