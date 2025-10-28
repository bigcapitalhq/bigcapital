// @ts-nocheck
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
import {
  If,
  Icon,
  FormattedMessage as T,
  Group,
  FSelect,
  PageForm,
} from '@/components';
import { useCreditNoteFormContext } from './CreditNoteFormProvider';
import {
  BrandingThemeFormGroup,
  BrandingThemeSelectButton,
} from '@/containers/BrandingTemplates/BrandingTemplatesSelectFields';
import { useCreditNoteFormBrandingTemplatesOptions } from './utils';
import { MoreIcon } from '@/icons/More';
import { useDrawerActions } from '@/hooks/state';
import { DRAWERS } from '@/constants/drawers';

/**
 * Credit note floating actions.
 */
export default function CreditNoteFloatingActions() {
  const history = useHistory();
  const { openDrawer } = useDrawerActions();

  // Formik context.
  const { resetForm, submitForm, isSubmitting } = useFormikContext();

  // Credit note form context.
  const { setSubmitPayload, creditNote } = useCreditNoteFormContext();

  // Handle submit as open button click.
  const handleSubmitOpenBtnClick = (event) => {
    setSubmitPayload({ redirect: true, open: true });
    submitForm();
  };

  // Handle submit, open and another new button click.
  const handleSubmitOpenAndNewBtnClick = (event) => {
    setSubmitPayload({ redirect: false, open: true, resetForm: true });
    submitForm();
  };

  // Handle submit as open & continue editing button click.
  const handleSubmitOpenContinueEditingBtnClick = (event) => {
    setSubmitPayload({ redirect: false, open: true });
    submitForm();
  };
  // Handle submit as draft button click.
  const handleSubmitDraftBtnClick = (event) => {
    setSubmitPayload({ redirect: true, open: false });
    submitForm();
  };

  // handle submit as draft & new button click.
  const handleSubmitDraftAndNewBtnClick = (event) => {
    setSubmitPayload({ redirect: false, open: false, resetForm: true });
    submitForm();
  };

  // Handle submit as draft & continue editing button click.
  const handleSubmitDraftContinueEditingBtnClick = (event) => {
    setSubmitPayload({ redirect: false, open: false });
    submitForm();
  };

  // Handle cancel button click.
  const handleCancelBtnClick = (event) => {
    history.goBack();
  };

  // Handle clear button click.
  const handleClearBtnClick = (event) => {
    resetForm();
  };

  // Handles the credit note customize button click.
  const handleCustomizeBtnClick = () => {
    openDrawer(DRAWERS.BRANDING_TEMPLATES, { resource: 'CreditNote' });
  };

  const brandingTemplatesOptions = useCreditNoteFormBrandingTemplatesOptions();

  return (
    <PageForm.FooterActions position={'apart'} spacing={20}>
      <Group spacing={10}>
        {/* ----------- Save And Open  ----------- */}
        <If condition={!creditNote || !creditNote?.is_open}>
          <ButtonGroup>
            <Button
              disabled={isSubmitting}
              loading={isSubmitting}
              intent={Intent.PRIMARY}
              onClick={handleSubmitOpenBtnClick}
              text={<T id={'save_open'} />}
            />
            <Popover
              content={
                <Menu>
                  <MenuItem
                    text={<T id={'open_and_new'} />}
                    onClick={handleSubmitOpenAndNewBtnClick}
                  />
                  <MenuItem
                    text={<T id={'open_continue_editing'} />}
                    onClick={handleSubmitOpenContinueEditingBtnClick}
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
        <If condition={creditNote && creditNote?.is_open}>
          <ButtonGroup>
            <Button
              loading={isSubmitting}
              intent={Intent.PRIMARY}
              onClick={handleSubmitOpenBtnClick}
              style={{ minWidth: '85px' }}
              text={<T id={'save'} />}
            />
            <Popover
              content={
                <Menu>
                  <MenuItem
                    text={<T id={'save_and_new'} />}
                    onClick={handleSubmitOpenAndNewBtnClick}
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
          text={creditNote ? <T id={'reset'} /> : <T id={'clear'} />}
        />
        {/* ----------- Cancel ----------- */}
        <Button
          className={'ml1'}
          disabled={isSubmitting}
          onClick={handleCancelBtnClick}
          text={<T id={'cancel'} />}
        />
      </Group>

      <Group spacing={0}>
        {/* ----------- Branding Template Select ----------- */}
        <BrandingThemeFormGroup
          name={'pdf_template_id'}
          label={'Branding'}
          inline
          fastField
          style={{ marginLeft: 20 }}
        >
          <FSelect
            name={'pdf_template_id'}
            items={brandingTemplatesOptions}
            input={({ activeItem, text, label, value }) => (
              <BrandingThemeSelectButton text={text || 'Brand Theme'} minimal />
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
