import { describe, expect, it } from 'vitest';
import {
  assertValidExtensionId,
  extensionFeatureKey,
  extensionJobName,
  extensionMigrationTable,
  extensionRoutePrefix,
  extensionSettingsGroup,
  extensionSlug,
  extensionSocketEvent,
  extensionSubject,
  extensionTablePrefix,
  extensionWebRoutePrefix,
  isExtensionFeatureKey,
  isExtensionSubject,
  sanitizeExtensionId,
} from '../namespaces';

describe('extension namespaces', () => {
  const id = 'acme.reports';

  it('namespaces feature keys', () => {
    expect(extensionFeatureKey(id, 'revenue')).toBe('ext:acme.reports:revenue');
    expect(isExtensionFeatureKey(id, 'ext:acme.reports:revenue')).toBe(true);
    expect(isExtensionFeatureKey(id, 'ext:other:revenue')).toBe(false);
  });

  it('namespaces CASL subjects', () => {
    expect(extensionSubject(id, 'Report')).toBe('ext:acme.reports:Report');
    expect(isExtensionSubject(id, 'ext:acme.reports:Report')).toBe(true);
    expect(isExtensionSubject(id, 'Report')).toBe(false);
  });

  it('namespaces settings, jobs, and socket events', () => {
    expect(extensionSettingsGroup(id)).toBe('ext:acme.reports');
    expect(extensionJobName(id, 'nightly-sync')).toBe(
      'ext:acme.reports:nightly-sync',
    );
    expect(extensionSocketEvent(id, 'report-ready')).toBe(
      'ext:acme.reports:report-ready',
    );
  });

  it('namespaces routes', () => {
    expect(extensionRoutePrefix(id)).toBe('ext/acme.reports');
    expect(extensionWebRoutePrefix(id)).toBe('/ext/acme.reports');
  });

  it('sanitizes ids', () => {
    expect(sanitizeExtensionId('Acme.Reports')).toBe('acme_reports');
    expect(sanitizeExtensionId('acme--reports')).toBe('acme_reports');
  });

  it('generates stable, bounded slugs', () => {
    const slug = extensionSlug(id);

    expect(slug).toBe(extensionSlug(id));
    expect(slug.length).toBeLessThanOrEqual(41);
    expect(extensionMigrationTable(id).length).toBeLessThanOrEqual(64);
    expect(extensionTablePrefix(id).startsWith('ext_')).toBe(true);
  });

  it('keeps generated identifiers under the MySQL limit for long ids', () => {
    const longId = `acme.${'very-long-extension-name-'.repeat(6)}`;

    expect(extensionMigrationTable(longId).length).toBeLessThanOrEqual(64);
    expect(extensionTablePrefix(longId).length).toBeLessThanOrEqual(64);
  });

  it('rejects invalid ids', () => {
    expect(() => assertValidExtensionId('Acme Reports')).toThrow(
      /Invalid extension id/,
    );
    expect(() => assertValidExtensionId('acme.reports')).not.toThrow();
  });
});
