import { omit } from 'lodash';
import { InvoiceCustomizeValues } from './types';
import { CreatePdfTemplateValues, EditPdfTemplateValues } from '@/hooks/query/pdf-templates';

export const transformToEditRequest = (
  values: InvoiceCustomizeValues,
  templateId: number,
): EditPdfTemplateValues => {
  return {
    templateId,
    templateName: 'Template Name',
    attributes: omit(values, ['templateName']),
  };
};

export const transformToNewRequest = (
  values: InvoiceCustomizeValues,
): CreatePdfTemplateValues => {
  return {
    resource: 'SaleInvoice',
    templateName: 'Template Name',
    attributes: omit(values, ['templateName']),
  };
};
