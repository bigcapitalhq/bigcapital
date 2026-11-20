import {
  DUPLICATE_SALE_INVOICE_MAX_NUMBER_TRIES,
  resolveDuplicateInvoiceNumber,
  transformSaleInvoiceToDuplicateDTO,
} from './DuplicateSaleInvoice.utils';

const buildSaleInvoice = (overrides: Record<string, any> = {}) => ({
  id: 12,
  invoiceNo: 'INV-00012',
  customerId: 3,
  invoiceDate: '2023-01-01',
  dueDate: '2023-01-31',
  referenceNo: 'PO-4',
  invoiceMessage: 'Thanks for your business.',
  termsConditions: 'Net 30',
  discount: 50,
  discountType: 'amount',
  adjustment: -10,
  exchangeRate: 1,
  branchId: 2,
  warehouseId: null,
  pdfTemplateId: 1,
  isInclusiveTax: 1,
  deliveredAt: '2023-01-01 10:00:00',
  paymentAmount: 100,
  entries: [
    {
      id: 102,
      index: 2,
      itemId: 7,
      quantity: 1,
      rate: 25,
      description: 'Second line',
      discount: null,
      discountType: 'percentage',
      taxRateId: null,
      costAccountId: 1050,
    },
    {
      id: 101,
      index: 1,
      itemId: 5,
      quantity: 10,
      rate: 100,
      description: 'First line',
      discount: 5,
      discountType: 'percentage',
      taxRateId: 4,
      sellAccountId: 1026,
      warehouseId: null,
    },
  ],
  paymentMethods: [{ id: 40, paymentIntegrationId: 3, enable: 1 }],
  attachments: [{ key: 'invoice.pdf' }],
  ...overrides,
});

const dates = {
  invoiceDate: new Date(2023, 2, 1),
  dueDate: new Date(2023, 2, 8),
};

describe('transformSaleInvoiceToDuplicateDTO', () => {
  it('copies the customer, message, terms, reference, discount and adjustment', () => {
    const dto = transformSaleInvoiceToDuplicateDTO(buildSaleInvoice(), dates);

    expect(dto).toMatchObject({
      customerId: 3,
      referenceNo: 'PO-4',
      invoiceMessage: 'Thanks for your business.',
      termsConditions: 'Net 30',
      discount: 50,
      discountType: 'amount',
      adjustment: -10,
      exchangeRate: 1,
      branchId: 2,
      pdfTemplateId: 1,
    });
  });

  it('dates the duplicate with the given dates and keeps it a draft', () => {
    const dto = transformSaleInvoiceToDuplicateDTO(buildSaleInvoice(), dates);

    expect(dto.invoiceDate).toEqual(new Date(2023, 2, 1));
    expect(dto.dueDate).toEqual(new Date(2023, 2, 8));
    expect(dto.delivered).toBe(false);
  });

  it('copies every line item in order without the entry ids', () => {
    const dto = transformSaleInvoiceToDuplicateDTO(buildSaleInvoice(), dates);

    expect(dto.entries).toEqual([
      {
        index: 1,
        itemId: 5,
        quantity: 10,
        rate: 100,
        description: 'First line',
        discount: 5,
        discountType: 'percentage',
        taxRateId: 4,
        sellAccountId: 1026,
      },
      {
        index: 2,
        itemId: 7,
        quantity: 1,
        rate: 25,
        description: 'Second line',
        discountType: 'percentage',
        costAccountId: 1050,
      },
    ]);
  });

  it('converts the stored tinyint flags to booleans', () => {
    const dto = transformSaleInvoiceToDuplicateDTO(buildSaleInvoice(), dates);

    expect(dto.isInclusiveTax).toBe(true);
    expect(dto.paymentMethods).toEqual([
      { paymentIntegrationId: 3, enable: true },
    ]);
  });

  it('never copies the invoice id, payments, attachments or delivery', () => {
    const dto = transformSaleInvoiceToDuplicateDTO(
      buildSaleInvoice(),
      dates,
    ) as Record<string, any>;

    expect(dto.id).toBeUndefined();
    expect(dto.paymentAmount).toBeUndefined();
    expect(dto.attachments).toBeUndefined();
    expect(dto.deliveredAt).toBeUndefined();
  });

  it('omits null fields and keeps empty strings', () => {
    const dto = transformSaleInvoiceToDuplicateDTO(
      buildSaleInvoice({ invoiceMessage: '', termsConditions: null }),
      dates,
    ) as Record<string, any>;

    expect(dto.invoiceMessage).toBe('');
    expect(dto).not.toHaveProperty('termsConditions');
    expect(dto).not.toHaveProperty('warehouseId');
  });

  it('sets the invoice number only when one is given', () => {
    expect(
      transformSaleInvoiceToDuplicateDTO(buildSaleInvoice(), dates),
    ).not.toHaveProperty('invoiceNo');
    expect(
      transformSaleInvoiceToDuplicateDTO(buildSaleInvoice(), {
        ...dates,
        invoiceNo: 'INV-00013',
      }).invoiceNo,
    ).toBe('INV-00013');
  });

  it('omits payment methods when the invoice has none', () => {
    expect(
      transformSaleInvoiceToDuplicateDTO(
        buildSaleInvoice({ paymentMethods: [] }),
        dates,
      ),
    ).not.toHaveProperty('paymentMethods');
  });
});

describe('resolveDuplicateInvoiceNumber', () => {
  const taken =
    (...invoiceNos: string[]) =>
    async (invoiceNo: string) =>
      invoiceNos.includes(invoiceNo);

  it('leaves the auto-increment sequence alone when its next number is free', async () => {
    const result = await resolveDuplicateInvoiceNumber(
      { autoIncrement: true, prefix: 'INV-', nextNumber: '00013' },
      'INV-00012',
      taken('INV-00012'),
    );
    expect(result).toEqual({});
  });

  it('advances the auto-increment sequence past numbers already in use', async () => {
    const result = await resolveDuplicateInvoiceNumber(
      { autoIncrement: true, prefix: 'INV-', nextNumber: '00013' },
      'INV-00012',
      taken('INV-00013', 'INV-00014'),
    );
    expect(result).toEqual({ nextNumber: '00015' });
  });

  it('keeps the zero padding of the sequence', async () => {
    const result = await resolveDuplicateInvoiceNumber(
      { autoIncrement: true, prefix: 'INV-', nextNumber: '00009' },
      'INV-00008',
      taken('INV-00009'),
    );
    expect(result).toEqual({ nextNumber: '00010' });
  });

  it('increments the original number when auto-increment is disabled', async () => {
    const result = await resolveDuplicateInvoiceNumber(
      { autoIncrement: false, prefix: 'INV-', nextNumber: '00013' },
      'INV-00012',
      taken('INV-00013'),
    );
    expect(result).toEqual({ invoiceNo: 'INV-00014' });
  });

  it('gives up instead of looping forever', async () => {
    await expect(
      resolveDuplicateInvoiceNumber(
        { autoIncrement: true, prefix: 'INV-', nextNumber: '1' },
        'INV-0',
        async () => true,
      ),
    ).rejects.toThrow(`after ${DUPLICATE_SALE_INVOICE_MAX_NUMBER_TRIES} tries`);
  });
});
