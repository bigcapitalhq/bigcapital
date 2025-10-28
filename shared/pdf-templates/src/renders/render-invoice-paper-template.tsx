import {
  InvoicePaperTemplate,
  InvoicePaperTemplateProps,
} from '../components/InvoicePaperTemplate';
import { renderSSR } from './render-ssr';

export const renderInvoicePaperTemplateHtml = (
  props: InvoicePaperTemplateProps
) => {
  return renderSSR(
    <InvoicePaperTemplate {...props} />
  );
};
