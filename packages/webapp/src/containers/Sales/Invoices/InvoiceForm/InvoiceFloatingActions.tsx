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
import { useInvoiceFormContext } from './InvoiceFormProvider';
import { useInvoiceFormBrandingTemplatesOptions } from './utils';
import type { InvoiceFormValues } from './utils';
import { If, Icon, FormattedMessage as T, Group, FSelect } from '@/components';
import { PageForm } from '@/components/PageForm';
import { DRAWERS } from '@/constants/drawers';
import {
  BrandingThemeFormGroup,
  BrandingThemeSelectButton,
} from '@/containers/BrandingTemplates/BrandingTemplatesSelectFields';
import { useDrawerActions } from '@/hooks/state';
import { useIsDarkMode } from '@/hooks/useDarkMode';
import { MoreIcon } from '@/icons/More';

/**
 * Invoice floating actions bar.
 */
export function InvoiceFloatingActions() {
  const history = useHistory();
  const isDarkMode = useIsDarkMode();
  const { openDrawer } = useDrawerActions();

  // Formik context.
  const { resetForm, submitForm, isSubmitting } =
    useFormikContext<InvoiceFormValues>();

  // Invoice form context.
  const { setSubmitPayload, invoice } = useInvoiceFormContext();

  // Handle submit & deliver button click.
  const handleSubmitDeliverBtnClick = () => {
    setSubmitPayload({ redirect: true, deliver: true });
    submitForm();
  };

  // Handle submit, deliver & new button click.
  const handleSubmitDeliverAndNewBtnClick = () => {
    setSubmitPayload({ redirect: false, deliver: true, resetForm: true });
    submitForm();
  };

  // Handle submit, deliver & continue editing button click.
  const handleSubmitDeliverContinueEditingBtnClick = () => {
    setSubmitPayload({ redirect: false, deliver: true });
    submitForm();
  };

  // Handle submit as draft button click.
  const handleSubmitDraftBtnClick = () => {
    setSubmitPayload({ redirect: true, deliver: false });
    submitForm();
  };

  // Handle submit as draft & new button click.
  const handleSubmitDraftAndNewBtnClick = () => {
    setSubmitPayload({ redirect: false, deliver: false, resetForm: true });
    submitForm();
  };

  // Handle submit as draft & continue editing button click.
  const handleSubmitDraftContinueEditingBtnClick = () => {
    setSubmitPayload({ redirect: false, deliver: false });
    submitForm();
  };

  // Handle cancel button click.
  const handleCancelBtnClick = () => {
    history.goBack();
  };

  // Handle clear button click.
  const handleClearBtnClick = () => {
    resetForm();
  };

  // Handles the invoice customize button click.
  const handleCustomizeBtnClick = () => {
    openDrawer(DRAWERS.BRANDING_TEMPLATES, { resource: 'SaleInvoice' });
  };

  const brandingTemplatesOptions = useInvoiceFormBrandingTemplatesOptions();

  return (
    <PageForm.FooterActions spacing={10} position={'apart'}>
      <Group spacing={10}>
        {/* ----------- Save And Deliver ----------- */}
        <If condition={!invoice || !invoice?.isDelivered}>
          <ButtonGroup>
            <Button
              disabled={isSubmitting}
              loading={isSubmitting}
              intent={Intent.PRIMARY}
              onClick={handleSubmitDeliverBtnClick}
              text={<T id={'save_and_deliver'} />}
            />
            <Popover
              content={
                <Menu>
                  <MenuItem
                    text={<T id={'deliver_and_new'} />}
                    onClick={handleSubmitDeliverAndNewBtnClick}
                  />
                  <MenuItem
                    text={<T id={'deliver_continue_editing'} />}
                    onClick={handleSubmitDeliverContinueEditingBtnClick}
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
        <If condition={!!invoice && !!invoice?.isDelivered}>
          <ButtonGroup>
            <Button
              disabled={isSubmitting}
              loading={isSubmitting}
              intent={Intent.PRIMARY}
              onClick={handleSubmitDeliverBtnClick}
              style={{ minWidth: '85px' }}
              text={<T id={'save'} />}
            />
            <Popover
              content={
                <Menu>
                  <MenuItem
                    text={<T id={'save_and_new'} />}
                    onClick={handleSubmitDeliverAndNewBtnClick}
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
          text={invoice ? <T id={'reset'} /> : <T id={'clear'} />}
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
            input={({ text }: { text?: string }) => (
              <BrandingThemeSelectButton text={text || 'Brand Theme'} />
            )}
            filterable={false}
            popoverProps={{ minimal: true }}
          />
        </BrandingThemeFormGroup>

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
          <Button
            minimal
            icon={
              <MoreIcon
                fill={isDarkMode ? '#fff' : '#000'}
                height={'14px'}
                width={'14px'}
              />
            }
          />
        </Popover>
      </Group>
    </PageForm.FooterActions>
  );
}
