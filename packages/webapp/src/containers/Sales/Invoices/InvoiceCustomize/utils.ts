import { omit } from 'lodash';
import { InvoiceCustomizeFormValues } from './types';
import {
  CreatePdfTemplateValues,
  EditPdfTemplateValues,
} from '@/hooks/query/pdf-templates';
import { transformToForm } from '@/utils';
import { initialValues } from './constants';
import { useBrandingTemplateBoot } from '@/containers/BrandingTemplates/BrandingTemplateBoot';

export const transformToEditRequest = (
  values: InvoiceCustomizeFormValues,
): EditPdfTemplateValues => {
  return {
    templateName: values.templateName,
    attributes: omit(values, ['templateName']),
  };
};

export const transformToNewRequest = (
  values: InvoiceCustomizeFormValues,
): CreatePdfTemplateValues => {
  return {
    resource: 'SaleInvoice',
    templateName: values.templateName,
    attributes: omit(values, ['templateName']),
  };
};

export const useInvoiceCustomizeInitialValues = (): InvoiceCustomizeFormValues => {
  const { pdfTemplate } = useBrandingTemplateBoot();

  const defaultPdfTemplate = {
    templateName: pdfTemplate?.templateName,
    ...pdfTemplate?.attributes,
  };
  return {
    ...initialValues,
    ...(transformToForm(
      defaultPdfTemplate,
      initialValues,
    ) as InvoiceCustomizeFormValues),
  };
};
