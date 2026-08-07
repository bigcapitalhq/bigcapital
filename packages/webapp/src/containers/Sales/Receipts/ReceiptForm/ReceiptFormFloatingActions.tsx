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
import React from 'react';
import { useHistory } from 'react-router-dom';
import { useReceiptFormContext } from './ReceiptFormProvider';
import { useReceiptFormBrandingTemplatesOptions } from './utils';
import type { ReceiptFormValues } from './utils';
import { FSelect, Group, FormattedMessage as T } from '@/components';
import { If, Icon } from '@/components';
import { PageForm } from '@/components/PageForm';
import { DRAWERS } from '@/constants/drawers';
import {
  BrandingThemeFormGroup,
  BrandingThemeSelectButton,
} from '@/containers/BrandingTemplates/BrandingTemplatesSelectFields';
import { useDrawerActions } from '@/hooks/state';
import { MoreIcon } from '@/icons/More';

type ReactClickHandler = React.MouseEventHandler<HTMLElement>;

/**
 * Receipt floating actions bar.
 */
export function ReceiptFormFloatingActions() {
  // History context.
  const history = useHistory();

  const { openDrawer } = useDrawerActions();

  // Formik context.
  const { resetForm, submitForm, isSubmitting } =
    useFormikContext<ReceiptFormValues>();

  // Receipt form context.
  const { receipt, setSubmitPayload } = useReceiptFormContext();

  // Handle submit & close button click.
  const handleSubmitCloseBtnClick: ReactClickHandler = () => {
    setSubmitPayload({ redirect: true, status: true });
    submitForm();
  };

  // Handle submit, close & new button click.
  const handleSubmitCloseAndNewBtnClick: ReactClickHandler = () => {
    setSubmitPayload({ redirect: false, status: true, resetForm: true });
    submitForm();
  };

  // Handle submit, close & continue editing button click.
  const handleSubmitCloseContinueEditingBtnClick: ReactClickHandler = () => {
    setSubmitPayload({ redirect: false, status: true });
    submitForm();
  };

  // Handle submit & draft button click.
  const handleSubmitDraftBtnClick: ReactClickHandler = () => {
    setSubmitPayload({ redirect: true, status: false });
    submitForm();
  };

  // Handle submit, draft & new button click.
  const handleSubmitDraftAndNewBtnClick: ReactClickHandler = () => {
    setSubmitPayload({ redirect: false, status: false, resetForm: true });
    submitForm();
  };

  const handleSubmitDraftContinueEditingBtnClick: ReactClickHandler = () => {
    setSubmitPayload({ redirect: false, status: false });
    submitForm();
  };

  // Handle cancel button click.
  const handleCancelBtnClick: ReactClickHandler = () => {
    history.goBack();
  };

  // Handle the clear button click.
  const handleClearBtnClick: ReactClickHandler = () => {
    resetForm();
  };

  // Handles the invoice customize button click.
  const handleCustomizeBtnClick = () => {
    openDrawer(DRAWERS.BRANDING_TEMPLATES, { resource: 'SaleReceipt' });
  };

  const brandingTemplatesOptions = useReceiptFormBrandingTemplatesOptions();

  return (
    <PageForm.FooterActions spacing={10} position="apart">
      <Group spacing={10}>
        {/* ----------- Save And Close ----------- */}
        <If condition={!receipt || !receipt?.closed}>
          <ButtonGroup>
            <Button
              disabled={isSubmitting}
              loading={isSubmitting}
              intent={Intent.PRIMARY}
              onClick={handleSubmitCloseBtnClick}
              text={<T id={'save_close'} />}
            />
            <Popover
              content={
                <Menu>
                  <MenuItem
                    text={<T id={'close_and_new'} />}
                    onClick={handleSubmitCloseAndNewBtnClick}
                  />
                  <MenuItem
                    text={<T id={'close_continue_editing'} />}
                    onClick={handleSubmitCloseContinueEditingBtnClick}
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

        {/* ----------- Save and New ----------- */}
        <If condition={Boolean(receipt && receipt?.closed)}>
          <ButtonGroup>
            <Button
              disabled={isSubmitting}
              intent={Intent.PRIMARY}
              onClick={handleSubmitCloseBtnClick}
              style={{ minWidth: '85px' }}
              text={<T id={'save'} />}
            />
            <Popover
              content={
                <Menu>
                  <MenuItem
                    text={<T id={'save_and_new'} />}
                    onClick={handleSubmitCloseAndNewBtnClick}
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
          text={receipt ? <T id={'reset'} /> : <T id={'clear'} />}
        />
        {/* ----------- Cancel ----------- */}
        <Button
          className={'ml1'}
          onClick={handleCancelBtnClick}
          text={<T id={'cancel'} />}
        />
      </Group>

      <Group spacing={0}>
        {/* ----------- Branding Template Select ----------- */}
        <BrandingThemeFormGroup
          name={'pdfTemplateId'}
          label={'Branding'}
          inline
          fastField
          style={{ marginLeft: 20 }}
        >
          <FSelect
            name={'pdfTemplateId'}
            items={brandingTemplatesOptions}
            input={() => (
              <BrandingThemeSelectButton text={'Brand Theme'} minimal />
            )}
            filterable={false}
            popoverProps={{ minimal: true }}
          />
        </BrandingThemeFormGroup>

        {/* ----------- Setting Select ----------- */}
        <Popover
          minimal={true}
          interactionKind={PopoverInteractionKind.CLICK}
          position={Position.TOP_RIGHT}
          modifiers={{
            offset: { offset: '0, 4' },
          }}
          content={
            <Menu>
              <MenuItem
                text={'Customize Templates'}
                onClick={handleCustomizeBtnClick}
              />
            </Menu>
          }
        >
          <Button minimal icon={<MoreIcon height={'14px'} width={'14px'} />} />
        </Popover>
      </Group>
    </PageForm.FooterActions>
  );
}
