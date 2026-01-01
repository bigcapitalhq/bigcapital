import {
  CreditNotePaperTemplate,
  CreditNotePaperTemplateProps,
} from '../components/CreditNotePaperTemplate';
import { renderSSR } from './render-ssr';

/**
 * Renders credit note paper template html.
 * @param {CreditNotePaperTemplateProps} props
 * @returns {string}
 */
export const renderCreditNotePaperTemplateHtml = (
  props: CreditNotePaperTemplateProps
) => {
  return renderSSR(<CreditNotePaperTemplate {...props} />);
};

