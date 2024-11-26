import {
  ReceiptPaperTemplate,
  ReceiptPaperTemplateProps,
} from '../components/ReceiptPaperTemplate';
import { renderSSR } from './render-ssr';

export const renderReceiptPaperTemplateHtml = (
  props: ReceiptPaperTemplateProps
) => {
  return renderSSR(<ReceiptPaperTemplate {...props} />);
};
