import { parseExtensionManifest } from '@bigcapital/extension-sdk/manifest';
import { Features } from '@/common/types/Features';
import { ExtensionContributionRegistry } from '@/extensions/extension.registry';
import { FeaturesConfigure } from './FeaturesConfigure';

const buildRegistry = () => {
  const registry = new ExtensionContributionRegistry();
  registry.registerManifest(
    parseExtensionManifest({
      id: 'acme.reports',
      name: 'Acme Reports',
      version: '1.0.0',
      trust: 'partner',
      features: [{ key: 'advanced', defaultValue: true }],
    }),
  );

  return registry;
};

const configService = {
  get: jest.fn().mockReturnValue(false),
} as any;

describe('FeaturesConfigure', () => {
  it('returns core features when no extension registry is available', () => {
    const configure = new FeaturesConfigure(configService);
    const features = configure.getConfigure();

    expect(features.some((feature) => feature.name === Features.BRANCHES)).toBe(
      true,
    );
    expect(features.some((feature) => feature.name.startsWith('ext:'))).toBe(
      false,
    );
  });

  it('appends extension features with namespaced keys', () => {
    const configure = new FeaturesConfigure(configService, buildRegistry());
    const features = configure.getConfigure();

    expect(features).toContainEqual({
      name: 'ext:acme.reports:advanced',
      defaultValue: true,
    });
  });
});
