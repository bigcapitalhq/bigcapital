import { defineServerExtension } from '@bigcapital/extension-sdk/server';
import { ExtensionValidationError } from './extension.errors';
import { validateExtensions } from './extension.loader';

const moduleDefinition = { module: class TestModule {} };

const buildExtension = (
  overrides: Partial<{
    id: string;
    name: string;
    version: string;
    apiVersion: string;
  }> = {},
) =>
  defineServerExtension({
    manifest: {
      id: overrides.id ?? 'acme.reports',
      name: overrides.name ?? 'Acme Reports',
      version: overrides.version ?? '1.0.0',
      apiVersion: overrides.apiVersion,
      trust: 'partner',
    },
    createModule: () => moduleDefinition,
  });

describe('validateExtensions', () => {
  it('normalizes the manifest defaults', () => {
    const [extension] = validateExtensions([buildExtension()]);

    expect(extension.manifest.apiVersion).toBe('^1.0.0');
    expect(extension.manifest.manifestVersion).toBe(1);
  });

  it('returns an empty list when no extensions are installed', () => {
    expect(validateExtensions([])).toEqual([]);
  });

  it('rejects duplicate extension ids', () => {
    expect(() =>
      validateExtensions([buildExtension(), buildExtension()]),
    ).toThrow(ExtensionValidationError);
  });

  it('rejects invalid manifests', () => {
    const invalid = {
      manifest: {
        id: 'Acme Reports',
        name: 'Acme Reports',
        version: '1.0.0',
        trust: 'partner',
      },
      createModule: () => moduleDefinition,
    } as any;

    expect(() => validateExtensions([invalid])).toThrow(
      ExtensionValidationError,
    );
  });

  it('rejects incompatible extension API versions', () => {
    expect(() =>
      validateExtensions([buildExtension({ apiVersion: '^2.0.0' })]),
    ).toThrow(/requires extension API/);
  });
});
