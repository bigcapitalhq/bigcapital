import {
  InvoicePaperTemplate,
  InvoicePaperTemplateProps,
} from '../components/InvoicePaperTemplate';
import { renderSSR } from './render-ssr';

export const renderInvoicePaperTemplateHtml = (
  props: InvoicePaperTemplateProps
) => {
  console.log("PROPS", props)
  return renderSSR(
    <InvoicePaperTemplate {...props} />
  );
};
