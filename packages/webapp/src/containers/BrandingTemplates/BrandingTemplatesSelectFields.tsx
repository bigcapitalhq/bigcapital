import { Button, ButtonProps } from '@blueprintjs/core';
import styled from 'styled-components';
import { FFormGroup, Icon } from '@/components';
import { NS } from '@/constants/classes';

export const BrandingThemeFormGroup = styled(FFormGroup)`
  margin-bottom: 0;

  .${NS}-label {
    color: #7a8492;
  }

  &.${NS}-inline label.${NS}-label {
    margin-right: 0;
  }
`;

export const BrandingThemeSelectButton = (props: ButtonProps) => {
  return (
    <Button
      text={props?.text || 'Brand Theme'}
      rightIcon={<Icon icon="arrow-drop-up-16" iconSize={20} />}
      minimal
      {...props}
    />
  );
};

export const convertBrandingTemplatesToOptions = (
  brandingTemplates: Array<any>,
) => {
  return brandingTemplates?.map((template) => ({
    text: template.templateName,
    value: template.id,
  }));
};
