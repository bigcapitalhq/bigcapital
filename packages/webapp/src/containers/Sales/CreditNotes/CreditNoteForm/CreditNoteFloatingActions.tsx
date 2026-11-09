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
import { useCreditNoteFormContext } from './CreditNoteFormProvider';
import { useCreditNoteFormBrandingTemplatesOptions } from './utils';
import type { CreditNoteFormValues } from './utils';
import {
  If,
  Icon,
  FormattedMessage as T,
  Group,
  FSelect,
  PageForm,
} from '@/components';
import { DRAWERS } from '@/constants/drawers';
import {
  BrandingThemeFormGroup,
  BrandingThemeSelectButton,
} from '@/containers/BrandingTemplates/BrandingTemplatesSelectFields';
import { useDrawerActions } from '@/hooks/state';
import { MoreIcon } from '@/icons/More';

/**
 * Credit note floating actions.
 */
export function CreditNoteFloatingActions() {
  const history = useHistory();
  const { openDrawer } = useDrawerActions();

  // Formik context.
  const { resetForm, submitForm, isSubmitting } =
    useFormikContext<CreditNoteFormValues>();

  // Credit note form context.
  const { setSubmitPayload, creditNote } = useCreditNoteFormContext();

  // Handle submit as open button click.
  const handleSubmitOpenBtnClick = (event: React.MouseEvent<HTMLElement>) => {
    setSubmitPayload({ redirect: true, open: true });
    submitForm();
  };

  // Handle submit, open and another new button click.
  const handleSubmitOpenAndNewBtnClick = (
    event: React.MouseEvent<HTMLElement>,
  ) => {
    setSubmitPayload({ redirect: false, open: true, resetForm: true });
    submitForm();
  };

  // Handle submit as open & continue editing button click.
  const handleSubmitOpenContinueEditingBtnClick = (
    event: React.MouseEvent<HTMLElement>,
  ) => {
    setSubmitPayload({ redirect: false, open: true });
    submitForm();
  };
  // Handle submit as draft button click.
  const handleSubmitDraftBtnClick = (event: React.MouseEvent<HTMLElement>) => {
    setSubmitPayload({ redirect: true, open: false });
    submitForm();
  };

  // handle submit as draft & new button click.
  const handleSubmitDraftAndNewBtnClick = (
    event: React.MouseEvent<HTMLElement>,
  ) => {
    setSubmitPayload({ redirect: false, open: false, resetForm: true });
    submitForm();
  };

  // Handle submit as draft & continue editing button click.
  const handleSubmitDraftContinueEditingBtnClick = (
    event: React.MouseEvent<HTMLElement>,
  ) => {
    setSubmitPayload({ redirect: false, open: false });
    submitForm();
  };

  // Handle cancel button click.
  const handleCancelBtnClick = (event: React.MouseEvent<HTMLElement>) => {
    history.goBack();
  };

  // Handle clear button click.
  const handleClearBtnClick = (event: React.MouseEvent<HTMLElement>) => {
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
        <If condition={!creditNote || !creditNote?.isOpen}>
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
        <If condition={Boolean(creditNote && creditNote?.isOpen)}>
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
          name={'pdfTemplateId'}
          label={'Branding'}
          inline
          fastField
          style={{ marginLeft: 20 }}
        >
          <FSelect
            name={'pdfTemplateId'}
            items={brandingTemplatesOptions}
            input={({ text }: { text?: string }) => (
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
