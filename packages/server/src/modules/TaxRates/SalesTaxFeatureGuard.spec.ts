import { Features } from '@/common/types/Features';
import { ServiceError } from '@/modules/Items/ServiceError';
import { SalesTaxFeatureGuard } from './SalesTaxFeatureGuard';
import { ERRORS } from './constants';

describe('SalesTaxFeatureGuard', () => {
  const buildGuard = (accessible: boolean) => {
    const featuresManager = {
      accessible: jest.fn().mockResolvedValue(accessible),
    };
    const guard = new SalesTaxFeatureGuard(featuresManager as any);
    return { guard, featuresManager };
  };

  it('allows the request when the sales tax feature is enabled', async () => {
    const { guard, featuresManager } = buildGuard(true);

    await expect(guard.canActivate({} as any)).resolves.toBe(true);
    expect(featuresManager.accessible).toHaveBeenCalledWith(Features.SALES_TAX);
  });

  it('rejects the request once the feature is disabled', async () => {
    const { guard } = buildGuard(false);

    try {
      await guard.canActivate({} as any);
      throw new Error('Expected the guard to throw');
    } catch (error) {
      expect(error).toBeInstanceOf(ServiceError);
      expect((error as ServiceError).errorType).toBe(
        ERRORS.SALES_TAX_FEATURE_NOT_ENABLED,
      );
    }
  });
});
