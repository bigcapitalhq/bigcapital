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
import { usePaymentReceiveFormContext } from './PaymentReceiveFormProvider';
import { usePaymentReceivedFormBrandingTemplatesOptions } from './utils';
import { FSelect, Group, Icon, FormattedMessage as T } from '@/components';
import { PageForm } from '@/components/PageForm';
import { DRAWERS } from '@/constants/drawers';
import {
  BrandingThemeFormGroup,
  BrandingThemeSelectButton,
} from '@/containers/BrandingTemplates/BrandingTemplatesSelectFields';
import { useDrawerActions } from '@/hooks/state';
import { MoreIcon } from '@/icons/More';

type BrandingSelectInputRenderArgs = {
  activeItem?: { value: string | number; label: string };
  text?: string;
  label?: string;
  value?: string | number;
};

/**
 * Payment receive floating actions bar.
 */
export function PaymentReceiveFormFloatingActions() {
  const { setSubmitPayload, isNewMode } = usePaymentReceiveFormContext();

  const { isSubmitting, submitForm, resetForm } = useFormikContext();

  const history = useHistory();

  const { openDrawer } = useDrawerActions();

  const handleSubmitBtnClick = () => {
    setSubmitPayload({ redirect: true });
  };
  const handleClearBtnClick = () => {
    resetForm();
  };
  const handleCancelBtnClick = () => {
    history.goBack();
  };
  const handleSubmitAndNewClick = () => {
    setSubmitPayload({ redirect: false, resetForm: true });
    submitForm();
  };
  const handleSubmitContinueEditingBtnClick = () => {
    setSubmitPayload({ redirect: false, publish: true });
    submitForm();
  };

  const handleCustomizeBtnClick = () => {
    openDrawer(DRAWERS.BRANDING_TEMPLATES, { resource: 'PaymentReceive' });
  };

  const brandingTemplatesOpts =
    usePaymentReceivedFormBrandingTemplatesOptions();

  return (
    <PageForm.FooterActions position={'apart'} spacing={20}>
      <Group spacing={10}>
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
          text={!isNewMode ? <T id={'reset'} /> : <T id={'clear'} />}
        />
        {/* ----------- Cancel  ----------- */}
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
            items={brandingTemplatesOpts}
            input={({ text }: BrandingSelectInputRenderArgs) => (
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
