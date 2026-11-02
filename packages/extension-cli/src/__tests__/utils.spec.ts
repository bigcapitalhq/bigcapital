import { describe, expect, it } from 'vitest';
import {
  createUniqueIdentifiers,
  parsePackageSpec,
  stableStringify,
  toIdentifier,
} from '../utils';

describe('parsePackageSpec', () => {
  it('parses scoped package specs', () => {
    expect(parsePackageSpec('@acme/reports@1.2.3')).toEqual({
      packageName: '@acme/reports',
      version: '1.2.3',
    });
    expect(parsePackageSpec('@acme/reports')).toEqual({
      packageName: '@acme/reports',
      version: undefined,
    });
  });

  it('parses unscoped package specs', () => {
    expect(parsePackageSpec('bigcapital-reports@1.2.3')).toEqual({
      packageName: 'bigcapital-reports',
      version: '1.2.3',
    });
    expect(parsePackageSpec('bigcapital-reports')).toEqual({
      packageName: 'bigcapital-reports',
      version: undefined,
    });
  });

  it('rejects non-exact versions', () => {
    expect(() => parsePackageSpec('@acme/reports@workspace:*')).toThrow(
      /exact version/,
    );
    expect(() => parsePackageSpec('@acme/reports@^1.2.3')).toThrow(
      /exact version/,
    );
  });
});

describe('toIdentifier', () => {
  it('creates camelCase identifiers from scoped packages', () => {
    expect(toIdentifier('@acme/bigcapital-reports')).toBe('bigcapitalReports');
    expect(toIdentifier('bigcapital-reports')).toBe('bigcapitalReports');
    expect(toIdentifier('@acme/bigcapital-reports', 'Web')).toBe(
      'bigcapitalReportsWeb',
    );
  });

  it('creates unique identifiers', () => {
    const identifiers = createUniqueIdentifiers(['@a/reports', '@b/reports']);

    expect(identifiers.get('@a/reports')).toBe('reports');
    expect(identifiers.get('@b/reports')).toBe('reports2');
  });
});

describe('stableStringify', () => {
  it('sorts object keys deterministically', () => {
    expect(stableStringify({ b: 1, a: { d: 2, c: 3 } })).toBe(
      '{"a":{"c":3,"d":2},"b":1}',
    );
  });
});
