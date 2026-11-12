import {
  renderCreditNotePaperTemplateHtml,
  renderEstimatePaperTemplateHtml,
  renderInvoicePaperTemplateHtml,
  renderPaymentReceivedPaperTemplateHtml,
  renderReceiptPaperTemplateHtml,
} from '@bigcapital/pdf-templates';

// Jest resolves `@bigcapital/pdf-templates` to its built `dist`, so build the
// package (`pnpm --filter @bigcapital/pdf-templates run build`) before running.
type RenderPaperTemplate = (props: Record<string, unknown>) => string;

const BASE_PROPS = {
  companyAddress: '<strong>Spacemaker</strong><br />Montréal QC',
};
const TAX = 'TPS/GST 123456789 RT0001\nTVQ/QST 1234567890 TQ0001';

describe.each([
  ['invoice', renderInvoicePaperTemplateHtml as unknown as RenderPaperTemplate],
  [
    'credit note',
    renderCreditNotePaperTemplateHtml as unknown as RenderPaperTemplate,
  ],
  [
    'estimate',
    renderEstimatePaperTemplateHtml as unknown as RenderPaperTemplate,
  ],
  ['receipt', renderReceiptPaperTemplateHtml as unknown as RenderPaperTemplate],
  [
    'payment received',
    renderPaymentReceivedPaperTemplateHtml as unknown as RenderPaperTemplate,
  ],
])('%s paper template: company tax number', (_name, render) => {
  const renderWith = (props: Record<string, unknown>) =>
    render({ ...BASE_PROPS, ...props });

  it('prints every line of the tax number inside the company block', () => {
    const html = renderWith({ companyTaxNumber: TAX });

    expect(html).toContain(TAX);
    expect(html.indexOf('TPS/GST')).toBeGreaterThan(
      html.indexOf('Montréal QC'),
    );
    expect(html.indexOf('TPS/GST')).toBeLessThan(html.indexOf('Billed To'));
  });

  it('escapes HTML in the tax number', () => {
    const html = renderWith({ companyTaxNumber: '<b>x</b>' });

    expect(html).toContain('>&lt;b&gt;x&lt;/b&gt;<');
    expect(html).not.toContain('<b>x</b>');
  });

  it('keeps accents and escapes ampersands', () => {
    const html = renderWith({ companyTaxNumber: 'N° TPS/GST 123 & Co' });

    expect(html).toContain('>N° TPS/GST 123 &amp; Co<');
  });

  it('does not leak the tax number props into HTML attributes', () => {
    const html = renderWith({
      showCompanyTaxNumber: true,
      companyTaxNumber: TAX,
    });

    expect(html).not.toMatch(/companyTaxNumber=/i);
    expect(html).not.toMatch(/showCompanyTaxNumber=/i);
  });

  it('prints CRLF values as clean lines', () => {
    const html = renderWith({ companyTaxNumber: 'A1\r\nB2' });

    expect(html).toContain('>A1\nB2<');
    expect(html).not.toContain('\r');
  });

  it('trims surrounding blank lines and spaces', () => {
    const html = renderWith({ companyTaxNumber: '\n  TPS 1\n\n' });

    expect(html).toContain('>TPS 1<');
  });

  it('wraps long unbroken numbers', () => {
    const longNumber = 'X'.repeat(255);
    const html = renderWith({ companyTaxNumber: longNumber });

    expect(html).toContain(longNumber);
    expect(html).toContain('overflow-wrap:anywhere');
  });

  it('hides the number when showCompanyTaxNumber is false', () => {
    const html = renderWith({
      showCompanyTaxNumber: false,
      companyTaxNumber: TAX,
    });

    expect(html).not.toContain('RT0001');
  });

  it('hides the number together with the address when showCompanyAddress is false', () => {
    const html = renderWith({
      showCompanyAddress: false,
      companyTaxNumber: TAX,
    });

    expect(html).not.toContain('RT0001');
    expect(html).not.toContain('Montréal QC');
  });

  it('adds nothing when the tax number is blank', () => {
    const blank = renderWith({ companyTaxNumber: '   ' });
    const switchedOff = renderWith({ showCompanyTaxNumber: false });

    expect(blank).toBe(switchedOff);
  });
});
