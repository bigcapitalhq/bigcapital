import { Injectable } from '@nestjs/common';
import type { SettingDefinition } from '@bigcapital/extension-sdk';
import { ExtensionNotFoundError } from '../extension.errors';
import { ExtensionManager } from '../extension.manager';
import { ExtensionContributionRegistry } from '../extension.registry';

export const EXTENSION_SECRET_MASK = '********';

export class ExtensionSettingsValidationError extends Error {
  constructor(public readonly issues: string[]) {
    super(`Invalid extension settings: ${issues.join(' ')}`);
    this.name = 'ExtensionSettingsValidationError';
  }
}

/**
 * Validates, stores, and masks extension settings.
 *
 * Settings are defined in the extension manifest. Secret values are stored in
 * the tenant settings JSON but are always masked before leaving the server.
 */
@Injectable()
export class ExtensionSettingsService {
  constructor(
    private readonly manager: ExtensionManager,
    private readonly registry: ExtensionContributionRegistry,
  ) {}

  getDefinitions(extensionId: string): SettingDefinition[] {
    const manifest = this.registry.getManifest(extensionId);

    if (!manifest) {
      throw new ExtensionNotFoundError(extensionId);
    }

    return manifest.settings;
  }

  /**
   * Merges manifest defaults with the values stored for a tenant.
   */
  getEffectiveSettings(
    extensionId: string,
    stored?: Record<string, unknown> | null,
  ): Record<string, unknown> {
    const settings: Record<string, unknown> = {};

    this.getDefinitions(extensionId).forEach((definition) => {
      if (definition.defaultValue !== undefined) {
        settings[definition.key] = definition.defaultValue;
      }
    });

    Object.entries(stored ?? {}).forEach(([key, value]) => {
      if (value !== undefined) {
        settings[key] = value;
      }
    });

    return settings;
  }

  /**
   * Returns effective settings with secrets masked for the admin UI.
   */
  getAdminSettings(
    extensionId: string,
    stored?: Record<string, unknown> | null,
  ): Record<string, unknown> {
    const settings = this.getEffectiveSettings(extensionId, stored);

    this.getDefinitions(extensionId).forEach((definition) => {
      if (
        definition.type === 'secret' &&
        settings[definition.key] !== undefined &&
        settings[definition.key] !== null &&
        settings[definition.key] !== ''
      ) {
        settings[definition.key] = EXTENSION_SECRET_MASK;
      }
    });

    return settings;
  }

  async getAdminSettingsForOrganization(
    extensionId: string,
    organizationId: string,
  ): Promise<Record<string, unknown>> {
    const record = await this.manager.getTenantRecord(
      extensionId,
      organizationId,
    );

    return this.getAdminSettings(extensionId, record?.settings);
  }

  /**
   * Returns safe admin settings. Extensions that are no longer compiled into
   * the deployment have no manifest to identify secret keys, so their stored
   * values are not exposed.
   */
  getAdminSettingsOrStored(
    extensionId: string,
    stored?: Record<string, unknown> | null,
  ): Record<string, unknown> {
    if (!this.registry.hasManifest(extensionId)) {
      return {};
    }

    return this.getAdminSettings(extensionId, stored);
  }

  /**
   * Returns only public, non-secret settings for boot metadata.
   */
  getPublicSettings(
    extensionId: string,
    stored?: Record<string, unknown> | null,
  ): Record<string, unknown> | undefined {
    const settings = this.getEffectiveSettings(extensionId, stored);
    const publicSettings: Record<string, unknown> = {};

    this.getDefinitions(extensionId).forEach((definition) => {
      if (!definition.public || definition.type === 'secret') {
        return;
      }

      if (settings[definition.key] !== undefined) {
        publicSettings[definition.key] = settings[definition.key];
      }
    });

    return Object.keys(publicSettings).length > 0 ? publicSettings : undefined;
  }

  async updateSettings(
    extensionId: string,
    organizationId: string,
    input: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    const definitions = this.getDefinitions(extensionId);
    const record = await this.manager.ensureTenantRecord(
      extensionId,
      organizationId,
    );

    const settings = this.validateSettings(
      definitions,
      this.getEffectiveSettings(extensionId, record.settings),
      input,
    );

    await this.manager.updateSettings(extensionId, organizationId, settings);

    return this.getAdminSettings(extensionId, settings);
  }

  /**
   * Validates a partial settings update and returns the merged settings.
   */
  validateSettings(
    definitions: SettingDefinition[],
    current: Record<string, unknown>,
    input: unknown,
  ): Record<string, unknown> {
    if (!input || typeof input !== 'object' || Array.isArray(input)) {
      throw new ExtensionSettingsValidationError([
        'Settings payload must be an object.',
      ]);
    }

    const definitionsByKey = new Map(
      definitions.map((definition) => [definition.key, definition]),
    );
    const issues: string[] = [];
    const merged: Record<string, unknown> = { ...current };

    Object.entries(input as Record<string, unknown>).forEach(([key, value]) => {
      const definition = definitionsByKey.get(key);

      if (!definition) {
        issues.push(`Unknown setting "${key}".`);
        return;
      }

      if (value === undefined) {
        return;
      }

      if (definition.type === 'secret' && value === EXTENSION_SECRET_MASK) {
        return;
      }

      const issue = validateSettingValue(definition, value);

      if (issue) {
        issues.push(issue);
        return;
      }

      merged[key] = value;
    });

    definitions.forEach((definition) => {
      if (!definition.required) {
        return;
      }

      if (isBlank(merged[definition.key])) {
        issues.push(`Setting "${definition.key}" is required.`);
      }
    });

    if (issues.length > 0) {
      throw new ExtensionSettingsValidationError(issues);
    }

    return merged;
  }
}

function validateSettingValue(
  definition: SettingDefinition,
  value: unknown,
): string | undefined {
  switch (definition.type) {
    case 'string':
    case 'secret':
      return typeof value === 'string'
        ? undefined
        : `Setting "${definition.key}" must be a string.`;
    case 'number':
      return typeof value === 'number' && Number.isFinite(value)
        ? undefined
        : `Setting "${definition.key}" must be a number.`;
    case 'boolean':
      return typeof value === 'boolean'
        ? undefined
        : `Setting "${definition.key}" must be a boolean.`;
    case 'enum':
      if (typeof value !== 'string') {
        return `Setting "${definition.key}" must be one of the allowed values.`;
      }

      if (definition.enumValues && !definition.enumValues.includes(value)) {
        return `Setting "${definition.key}" must be one of: ${definition.enumValues.join(', ')}.`;
      }

      return undefined;
    case 'json':
      if (!value || typeof value !== 'object') {
        return `Setting "${definition.key}" must be a JSON object or array.`;
      }

      return undefined;
    default:
      return `Setting "${definition.key}" has an unsupported type.`;
  }
}

function isBlank(value: unknown): boolean {
  return value === undefined || value === null || value === '';
}
