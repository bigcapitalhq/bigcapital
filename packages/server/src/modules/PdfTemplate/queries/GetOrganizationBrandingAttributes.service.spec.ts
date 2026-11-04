import { GetOrganizationBrandingAttributesService } from './GetOrganizationBrandingAttributes.service';

const makeService = (metadata: Record<string, unknown>) => {
  const tenancyContext = {
    getTenant: async () => ({ metadata }),
  };
  const presignedUrlService = {
    getPresignedUrl: async () => 'https://example.com/logo.png',
  };
  return new GetOrganizationBrandingAttributesService(
    tenancyContext as any,
    presignedUrlService as any,
  );
};

describe('GetOrganizationBrandingAttributesService', () => {
  it('returns the organization tax number as companyTaxNumber', async () => {
    const service = makeService({
      name: 'Spacemaker',
      taxNumber: 'TPS/GST 123456789 RT0001\nTVQ/QST 1234567890 TQ0001',
    });

    const result = await service.execute();

    expect(result.companyTaxNumber).toBe(
      'TPS/GST 123456789 RT0001\nTVQ/QST 1234567890 TQ0001',
    );
  });

  it('returns an empty string when the organization tax number is null', async () => {
    const service = makeService({ name: 'Spacemaker', taxNumber: null });

    const result = await service.execute();

    expect(result.companyTaxNumber).toBe('');
  });

  it('returns an empty string when the organization has no tax number', async () => {
    const service = makeService({ name: 'Spacemaker' });

    const result = await service.execute();

    expect(result.companyTaxNumber).toBe('');
  });
});
