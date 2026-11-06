import 'reflect-metadata';
import { PATH_METADATA } from '@nestjs/common/constants';
import { describe, expect, it } from 'vitest';
import {
  EXTENSION_CONTROLLER_METADATA_KEY,
  REQUIRE_FEATURE_KEY,
  ExtensionController,
  RequireFeature,
  defineServerExtension,
} from '../server';

describe('defineServerExtension', () => {
  it('normalizes the manifest defaults', () => {
    const extension = defineServerExtension({
      manifest: {
        id: 'acme.reports',
        name: 'Acme Reports',
        version: '1.0.0',
        trust: 'partner',
      },
      createModule: () => ({ module: class TestModule {} }),
    });

    expect(extension.manifest.apiVersion).toBe('^1.0.0');
    expect(extension.manifest.manifestVersion).toBe(1);
    expect(extension.manifest.capabilities).toEqual([]);
    expect(extension.manifest.defaultEnabled).toBe(false);
  });

  it('rejects an invalid manifest', () => {
    expect(() =>
      defineServerExtension({
        manifest: {
          id: 'Acme Reports',
          name: 'Acme Reports',
          version: '1.0.0',
          trust: 'partner',
        },
        createModule: () => ({ module: class TestModule {} }),
      }),
    ).toThrow(/Invalid extension manifest/);
  });
});

describe('ExtensionController', () => {
  it('mounts the controller under the extension namespace', () => {
    @ExtensionController('acme.reports', 'reports')
    class ReportsController {}

    expect(Reflect.getMetadata(PATH_METADATA, ReportsController)).toBe(
      'ext/acme.reports/reports',
    );
    expect(
      Reflect.getMetadata(EXTENSION_CONTROLLER_METADATA_KEY, ReportsController),
    ).toEqual({ extensionId: 'acme.reports' });
  });

  it('defaults to the extension route root', () => {
    @ExtensionController('acme.reports')
    class RootController {}

    expect(Reflect.getMetadata(PATH_METADATA, RootController)).toBe(
      'ext/acme.reports',
    );
  });

  it('normalizes leading and trailing slashes', () => {
    @ExtensionController('acme.reports', '/reports/')
    class ReportsController {}

    expect(Reflect.getMetadata(PATH_METADATA, ReportsController)).toBe(
      'ext/acme.reports/reports',
    );
  });
});

describe('RequireFeature', () => {
  it('sets the required feature metadata', () => {
    @RequireFeature('ext:acme.reports:advanced')
    class ReportsController {}

    expect(Reflect.getMetadata(REQUIRE_FEATURE_KEY, ReportsController)).toBe(
      'ext:acme.reports:advanced',
    );
  });
});
