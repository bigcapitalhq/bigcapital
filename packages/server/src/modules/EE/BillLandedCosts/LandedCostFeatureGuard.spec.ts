import { Features } from '@/common/types/Features';
import { ServiceError } from '@/modules/Items/ServiceError';
import { LandedCostFeatureGuard } from './LandedCostFeatureGuard';
import { ERRORS } from './utils';

describe('LandedCostFeatureGuard', () => {
  const buildGuard = (accessible: boolean) => {
    const featuresManager = {
      accessible: jest.fn().mockResolvedValue(accessible),
    };
    const guard = new LandedCostFeatureGuard(featuresManager as any);
    return { guard, featuresManager };
  };

  it('allows the request when the landed cost feature is enabled', async () => {
    const { guard, featuresManager } = buildGuard(true);

    await expect(guard.canActivate({} as any)).resolves.toBe(true);
    expect(featuresManager.accessible).toHaveBeenCalledWith(
      Features.LANDED_COST,
    );
  });

  it('rejects the request once the feature is disabled', async () => {
    const { guard } = buildGuard(false);

    try {
      await guard.canActivate({} as any);
      throw new Error('Expected the guard to throw');
    } catch (error) {
      expect(error).toBeInstanceOf(ServiceError);
      expect((error as ServiceError).errorType).toBe(
        ERRORS.LANDED_COST_FEATURE_NOT_ENABLED,
      );
    }
  });
});
