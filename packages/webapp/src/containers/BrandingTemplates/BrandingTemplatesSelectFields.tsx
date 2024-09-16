import { Button } from '@blueprintjs/core';
import styled from 'styled-components';
import { FFormGroup } from '@/components';

export const BrandingThemeFormGroup = styled(FFormGroup)`
  margin-bottom: 0;

  .bp4-label {
    color: #7a8492;
  }

  &.bp4-inline label.bp4-label {
    margin-right: 0;
  }
`;

export const BrandingThemeSelectButton = styled(Button)`
  position: relative;
  padding-right: 26px;

  &::after {
    content: '';
    display: inline-block;
    width: 0;
    height: 0;

    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 5px solid #98a1ae;

    position: absolute;
    right: -2px;
    top: 50%;
    margin-top: -2px;
    margin-right: 12px;
    border-radius: 1px;
  }
`;


export const convertBrandingTemplatesToOptions = (brandingTemplates: Array<any>) => {
  return brandingTemplates?.map(
    (template) =>
      ({ text: template.template_name, value: template.id } || []),
  )
}
