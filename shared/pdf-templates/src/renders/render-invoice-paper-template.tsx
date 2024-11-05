import { renderToString } from 'react-dom/server';
import createCache from '@emotion/cache';
import { css } from '@emotion/css';
import {
  InvoicePaperTemplate,
  InvoicePaperTemplateProps,
} from '../components/InvoicePaperTemplate';
import { PaperTemplateLayout } from '../components/PaperTemplateLayout';
import { extractCritical } from '@emotion/server';
import { OpenSansFontLink } from '../constants';
import { renderSSR } from './render-ssr';

export const renderInvoicePaperTemplateHtml = (
  props: InvoicePaperTemplateProps
) => {
  return renderSSR(
    <InvoicePaperTemplate
      {...props}
    />
  );
};
