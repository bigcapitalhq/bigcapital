import { renderToString } from 'react-dom/server';
import createCache from '@emotion/cache';
import {
  InvoicePaperTemplate,
  InvoicePaperTemplateProps,
} from '../components/InvoicePaperTemplate';
import { PaperTemplateLayout } from '../components/PaperTemplateLayout';
import { extractCritical } from '@emotion/server';

export const renderInvoicePaperTemplateHtml = (
  props: InvoicePaperTemplateProps
) => {
  const key = 'invoice-paper-template';
  const cache = createCache({ key });

  const renderedHtml = renderToString(
    <PaperTemplateLayout cache={cache}>
      <InvoicePaperTemplate {...props} />
    </PaperTemplateLayout>
  );
  const { html, css, ids } = extractCritical(renderedHtml);

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Invoice</title>
    <style data-emotion="${key} ${ids.join(' ')}">${css}</style>
</head>
<body>
    <div id="root">${html}</div>
</body>
</html>`;
};
