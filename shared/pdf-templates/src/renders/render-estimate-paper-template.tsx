import {
  EstimatePaperTemplate,
  EstimatePaperTemplateProps,
} from '../components/EstimatePaperTemplate';
import { renderSSR } from './render-ssr';

/**
 * Renders estimate paper template html.
 * @param {EstimatePaperTemplateProps} props
 * @returns {string}
 */
export const renderEstimatePaperTemplateHtml = (
  props: EstimatePaperTemplateProps
) => {
  return renderSSR(<EstimatePaperTemplate {...props} />);
};
