import { parseExtensionManifest } from '@bigcapital/extension-sdk/manifest';
import { ExtensionContributionRegistry } from '@/extensions/extension.registry';
import { RolePermissionsSchema } from './RolePermissionsSchema';

const i18n = {
  t: jest.fn((key: string) => `t:${key}`),
} as any;

const buildRegistry = () => {
  const registry = new ExtensionContributionRegistry();
  registry.registerManifest(
    parseExtensionManifest({
      id: 'acme.reports',
      name: 'Acme Reports',
      version: '1.0.0',
      trust: 'partner',
      abilities: [
        {
          subject: 'Report',
          subjectLabel: 'Report',
          abilities: [
            { key: 'View', label: 'View' },
            { key: 'Run', label: 'Run' },
          ],
        },
      ],
    }),
  );

  return registry;
};

describe('RolePermissionsSchema', () => {
  it('returns translated core abilities when no registry is available', () => {
    const schema = new RolePermissionsSchema(i18n).getRolePermissionsSchema();

    expect(schema.length).toBeGreaterThan(0);
    expect(
      schema.every((subject) => subject.subjectLabel.startsWith('t:')),
    ).toBe(true);
  });

  it('appends namespaced extension abilities with literal labels', () => {
    const schema = new RolePermissionsSchema(
      i18n,
      buildRegistry(),
    ).getRolePermissionsSchema();

    expect(schema).toContainEqual(
      expect.objectContaining({
        subject: 'ext:acme.reports:Report',
        subjectLabel: 'Report',
        abilities: [
          { key: 'View', label: 'View' },
          { key: 'Run', label: 'Run' },
        ],
      }),
    );
  });
});
