import {
  PaymentReceivedPaperTemplateProps,
  PaymentReceivedPaperTemplate,
} from '../components/PaymentReceivedPaperTemplate';
import { renderSSR } from './render-ssr';

export const renderPaymentReceivedPaperTemplateHtml = (
  props: PaymentReceivedPaperTemplateProps
) => {
  return renderSSR(<PaymentReceivedPaperTemplate {...props} />);
};
