import {
  ExportResourceTableTemplate,
  ExportResourceTableTemplateProps,
} from '../components/ExportResourceTableTemplate';
import { renderSSR } from './render-ssr';

export const renderExportResourceTableTemplateHtml = (
  props: ExportResourceTableTemplateProps
) => {
  return renderSSR(
    <ExportResourceTableTemplate {...props} />
  );
};

