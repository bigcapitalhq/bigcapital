import semver from 'semver';
import { z } from 'zod';
import {
  EXTENSION_CAPABILITIES,
  type ExtensionCapability,
} from './capabilities';
import {
  EXTENSION_ID_PATTERN,
  EXTENSION_KEY_PATTERN,
  EXTENSION_MANIFEST_VERSION,
  HOST_EXTENSION_API_VERSION,
} from './constants';

const extensionIdSchema = z
  .string()
  .min(1)
  .max(128)
  .regex(
    EXTENSION_ID_PATTERN,
    'Must be a lower-case identifier such as "acme.reports".',
  );

const extensionKeySchema = z
  .string()
  .min(1)
  .max(64)
  .regex(
    EXTENSION_KEY_PATTERN,
    'Must be a lower-case identifier using letters, numbers, dots, dashes, or underscores.',
  );

const abilityKeySchema = z
  .string()
  .min(1)
  .max(64)
  .regex(
    /^[A-Za-z][A-Za-z0-9._-]*$/,
    'Must start with a letter and use letters, numbers, dots, dashes, or underscores.',
  );

const semverRangeSchema = z
  .string()
  .refine(
    (value) => semver.validRange(value) !== null,
    'Must be a valid semver range.',
  );

const capabilitySchema = z.enum(
  EXTENSION_CAPABILITIES as unknown as [
    ExtensionCapability,
    ...ExtensionCapability[],
  ],
);

export const featureDefinitionSchema = z.object({
  key: extensionKeySchema,
  name: z.string().min(1).max(120).optional(),
  description: z.string().max(500).optional(),
  defaultValue: z.boolean().default(false),
  public: z.boolean().default(false),
});

export const abilityDefinitionSchema = z.object({
  subject: abilityKeySchema,
  subjectLabel: z.string().min(1).max(120),
  description: z.string().max(500).optional(),
  abilities: z
    .array(
      z.object({
        key: abilityKeySchema,
        label: z.string().min(1).max(120),
        default: z.boolean().optional(),
      }),
    )
    .min(1),
  extraAbilities: z
    .array(
      z.object({
        key: abilityKeySchema,
        label: z.string().min(1).max(120),
        default: z.boolean().optional(),
      }),
    )
    .optional(),
});

export const settingDefinitionSchema = z.object({
  key: extensionKeySchema,
  type: z.enum(['string', 'number', 'boolean', 'json', 'secret', 'enum']),
  title: z.string().min(1).max(120).optional(),
  description: z.string().max(500).optional(),
  defaultValue: z.unknown().optional(),
  enumValues: z.array(z.string()).optional(),
  public: z.boolean().default(false),
  required: z.boolean().default(false),
});

export const extensionManifestSchema = z
  .object({
    manifestVersion: z.literal(EXTENSION_MANIFEST_VERSION).default(1),
    id: extensionIdSchema,
    name: z.string().min(1).max(120),
    version: z
      .string()
      .refine((value) => semver.valid(value) !== null, 'Must be valid semver.'),
    apiVersion: semverRangeSchema.default(`^${HOST_EXTENSION_API_VERSION}`),
    engines: z
      .object({
        bigcapital: semverRangeSchema.optional(),
      })
      .optional(),
    trust: z.enum(['core', 'native', 'partner', 'third_party']),
    publisher: z.string().min(1).max(120).optional(),
    description: z.string().max(1000).optional(),
    homepage: z.string().url().optional(),
    server: z
      .object({
        entry: z.string().min(1),
      })
      .optional(),
    web: z
      .object({
        entry: z.string().min(1),
      })
      .optional(),
    migrations: z.string().min(1).optional(),
    capabilities: z.array(capabilitySchema).default([]),
    features: z.array(featureDefinitionSchema).default([]),
    abilities: z.array(abilityDefinitionSchema).default([]),
    settings: z.array(settingDefinitionSchema).default([]),
    defaultEnabled: z.boolean().default(false),
  })
  .superRefine((manifest, ctx) => {
    assertUniqueKeys(
      manifest.features.map((feature) => feature.key),
      ['features'],
      'key',
      ctx,
    );
    assertUniqueKeys(
      manifest.abilities.map((ability) => ability.subject),
      ['abilities'],
      'subject',
      ctx,
    );
    assertUniqueKeys(
      manifest.settings.map((setting) => setting.key),
      ['settings'],
      'key',
      ctx,
    );
  });

export type ExtensionManifest = z.infer<typeof extensionManifestSchema>;
export type ExtensionManifestInput = z.input<typeof extensionManifestSchema>;
export type ExtensionTrust = ExtensionManifest['trust'];
export type FeatureDefinition = z.infer<typeof featureDefinitionSchema>;
export type AbilityDefinition = z.infer<typeof abilityDefinitionSchema>;
export type SettingDefinition = z.infer<typeof settingDefinitionSchema>;

export interface ExtensionManifestIssue {
  path: string;
  message: string;
}

export class ExtensionManifestValidationError extends Error {
  constructor(public readonly issues: ExtensionManifestIssue[]) {
    super(
      [
        'Invalid extension manifest:',
        ...issues.map((issue) => `  - ${issue.path}: ${issue.message}`),
      ].join('\n'),
    );
    this.name = 'ExtensionManifestValidationError';
  }
}

/**
 * Parses and validates a manifest. Defaults are applied.
 *
 * @throws ExtensionManifestValidationError when the input is invalid.
 */
export function parseExtensionManifest(input: unknown): ExtensionManifest {
  const result = extensionManifestSchema.safeParse(input);

  if (!result.success) {
    throw new ExtensionManifestValidationError(
      result.error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      })),
    );
  }

  return result.data;
}

export function safeParseExtensionManifest(input: unknown) {
  return extensionManifestSchema.safeParse(input);
}

/**
 * Determines whether the host extension API version satisfies the range
 * declared by an extension.
 */
export function isExtensionApiVersionCompatible(
  apiVersion: string,
  hostApiVersion: string = HOST_EXTENSION_API_VERSION,
): boolean {
  return semver.satisfies(hostApiVersion, apiVersion, {
    includePrerelease: true,
  });
}

/**
 * Determines whether the host application version satisfies the range declared
 * by an extension.
 */
export function isHostVersionCompatible(
  range: string | undefined,
  hostVersion: string,
): boolean {
  if (!range) {
    return true;
  }

  return semver.satisfies(hostVersion, range, { includePrerelease: true });
}

/**
 * Asserts that an extension can run against the given host versions.
 */
export function assertExtensionCompatibility(
  manifest: ExtensionManifest,
  options: {
    hostApiVersion?: string;
    hostVersion?: string;
  } = {},
): void {
  const { hostApiVersion = HOST_EXTENSION_API_VERSION, hostVersion } = options;

  if (!isExtensionApiVersionCompatible(manifest.apiVersion, hostApiVersion)) {
    throw new Error(
      `Extension "${manifest.id}" requires extension API "${manifest.apiVersion}" but the host provides "${hostApiVersion}".`,
    );
  }

  if (
    hostVersion &&
    !isHostVersionCompatible(manifest.engines?.bigcapital, hostVersion)
  ) {
    throw new Error(
      `Extension "${manifest.id}" requires Bigcapital "${manifest.engines?.bigcapital}" but the host is "${hostVersion}".`,
    );
  }
}

function assertUniqueKeys(
  keys: string[],
  path: Array<string | number>,
  field: string,
  ctx: z.RefinementCtx,
): void {
  const seen = new Set<string>();

  keys.forEach((key, index) => {
    if (seen.has(key)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: [...path, index, field],
        message: `Duplicate key "${key}".`,
      });
      return;
    }

    seen.add(key);
  });
}
