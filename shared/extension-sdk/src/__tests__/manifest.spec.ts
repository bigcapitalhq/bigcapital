import { describe, expect, it } from 'vitest';
import {
  ExtensionManifestValidationError,
  assertExtensionCompatibility,
  isExtensionApiVersionCompatible,
  isHostVersionCompatible,
  parseExtensionManifest,
} from '../manifest';

const baseManifest = {
  id: 'acme.reports',
  name: 'Acme Reports',
  version: '1.0.0',
  trust: 'partner' as const,
};

describe('parseExtensionManifest', () => {
  it('applies defaults', () => {
    const manifest = parseExtensionManifest(baseManifest);

    expect(manifest.manifestVersion).toBe(1);
    expect(manifest.apiVersion).toBe('^1.0.0');
    expect(manifest.capabilities).toEqual([]);
    expect(manifest.features).toEqual([]);
    expect(manifest.abilities).toEqual([]);
    expect(manifest.settings).toEqual([]);
    expect(manifest.defaultEnabled).toBe(false);
  });

  it('rejects an invalid extension id', () => {
    expect(() =>
      parseExtensionManifest({ ...baseManifest, id: 'Acme Reports' }),
    ).toThrow(ExtensionManifestValidationError);
  });

  it('rejects an invalid api version range', () => {
    expect(() =>
      parseExtensionManifest({
        ...baseManifest,
        apiVersion: 'not-a-range',
      }),
    ).toThrow(ExtensionManifestValidationError);
  });

  it('rejects duplicate feature keys', () => {
    expect(() =>
      parseExtensionManifest({
        ...baseManifest,
        features: [{ key: 'revenue' }, { key: 'revenue' }],
      }),
    ).toThrow(ExtensionManifestValidationError);
  });

  it('rejects duplicate ability subjects', () => {
    try {
      parseExtensionManifest({
        ...baseManifest,
        abilities: [
          {
            subject: 'Report',
            subjectLabel: 'Report',
            abilities: [{ key: 'view', label: 'View' }],
          },
          {
            subject: 'Report',
            subjectLabel: 'Report',
            abilities: [{ key: 'run', label: 'Run' }],
          },
        ],
      });
    } catch (error) {
      expect(error).toBeInstanceOf(ExtensionManifestValidationError);
      expect((error as ExtensionManifestValidationError).issues[0].path).toBe(
        'abilities.1.subject',
      );
      return;
    }

    throw new Error('Expected duplicate ability subjects to be rejected.');
  });

  it('rejects duplicate setting keys', () => {
    expect(() =>
      parseExtensionManifest({
        ...baseManifest,
        settings: [
          { key: 'apiKey', type: 'secret' },
          { key: 'apiKey', type: 'string' },
        ],
      }),
    ).toThrow(ExtensionManifestValidationError);
  });

  it('rejects unknown capabilities', () => {
    expect(() =>
      parseExtensionManifest({
        ...baseManifest,
        capabilities: ['tenant.db.drop'],
      }),
    ).toThrow(ExtensionManifestValidationError);
  });
});

describe('compatibility', () => {
  it('checks the host extension API version against the declared range', () => {
    expect(isExtensionApiVersionCompatible('^1.0.0')).toBe(true);
    expect(isExtensionApiVersionCompatible('^2.0.0')).toBe(false);
    expect(isExtensionApiVersionCompatible('>=1.0.0 <2.0.0')).toBe(true);
  });

  it('checks the host application version against the declared range', () => {
    expect(isHostVersionCompatible('>=0.10.0', '0.10.2')).toBe(true);
    expect(isHostVersionCompatible('>=1.0.0', '0.10.2')).toBe(false);
    expect(isHostVersionCompatible(undefined, '0.10.2')).toBe(true);
  });

  it('throws a descriptive error for an incompatible API version', () => {
    const manifest = parseExtensionManifest({
      ...baseManifest,
      apiVersion: '^2.0.0',
    });

    expect(() => assertExtensionCompatibility(manifest)).toThrow(
      /requires extension API/,
    );
  });
});
