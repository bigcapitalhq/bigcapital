import { ForbiddenException } from '@nestjs/common';
import { ExtensionFeatureGuard } from './feature.guard';

const buildContext = () =>
  ({
    getHandler: () => ({}),
    getClass: () => class TestController {},
  }) as any;

const buildGuard = (feature: string | undefined, accessible: boolean) => {
  const reflector = {
    getAllAndOverride: jest.fn().mockReturnValue(feature),
  };
  const featuresManager = {
    accessible: jest.fn().mockResolvedValue(accessible),
  };

  return {
    guard: new ExtensionFeatureGuard(reflector as any, featuresManager as any),
    featuresManager,
  };
};

describe('ExtensionFeatureGuard', () => {
  it('allows routes without a feature requirement', async () => {
    const { guard, featuresManager } = buildGuard(undefined, false);

    await expect(guard.canActivate(buildContext())).resolves.toBe(true);
    expect(featuresManager.accessible).not.toHaveBeenCalled();
  });

  it('allows the route when the feature is accessible', async () => {
    const { guard } = buildGuard('ext:acme.reports:advanced', true);

    await expect(guard.canActivate(buildContext())).resolves.toBe(true);
  });

  it('rejects the route when the feature is not accessible', async () => {
    const { guard } = buildGuard('ext:acme.reports:advanced', false);

    await expect(guard.canActivate(buildContext())).rejects.toBeInstanceOf(
      ForbiddenException,
    );
  });
});
