import type {
  AbilityDefinition,
  ExtensionCapability,
  ExtensionEventHandler,
  ExtensionEventSubscriptionOptions,
  ExtensionManifest,
  FeatureDefinition,
  SettingDefinition,
} from '@bigcapital/extension-sdk';
import type { ExtensionJobDefinition } from '@bigcapital/extension-sdk/server';
import {
  AbilityCatalog,
  EventCatalog,
  FeatureCatalog,
  JobCatalog,
  SettingCatalog,
} from './catalog';
import { ExtensionCapabilityError } from './extension.errors';
import type {
  AbilityContribution,
  EventSubscriberContribution,
  FeatureContribution,
  JobContribution,
  SettingContribution,
} from './extension.types';

/**
 * Central registry of every extension contribution compiled into the host.
 *
 * The registry is created once in `ExtensionsModule.forRoot`, populated with
 * manifest-declared definition metadata, then used by feature/ability
 * aggregation and the event bridge.
 */
export class ExtensionContributionRegistry {
  readonly features = new FeatureCatalog();
  readonly abilities = new AbilityCatalog();
  readonly settings = new SettingCatalog();
  readonly events = new EventCatalog();
  readonly jobs = new JobCatalog();

  private readonly manifests = new Map<string, ExtensionManifest>();

  /**
   * Registers an extension manifest and its declarative contributions.
   *
   * Event subscribers and jobs are code-level contributions and are registered
   * by the extension module at creation time.
   */
  registerManifest(manifest: ExtensionManifest): void {
    if (this.manifests.has(manifest.id)) {
      throw new Error(
        `Extension "${manifest.id}" is already registered in the contribution registry.`,
      );
    }

    this.manifests.set(manifest.id, manifest);

    manifest.features.forEach((definition) => {
      this.features.registerForOwner(manifest.id, definition);
    });
    manifest.abilities.forEach((definition) => {
      this.abilities.registerForOwner(manifest.id, definition);
    });
    manifest.settings.forEach((definition) => {
      this.settings.registerForOwner(manifest.id, definition);
    });
  }

  getManifest(owner: string): ExtensionManifest | undefined {
    return this.manifests.get(owner);
  }

  getManifests(): ExtensionManifest[] {
    return Array.from(this.manifests.values());
  }

  hasManifest(owner: string): boolean {
    return this.manifests.has(owner);
  }

  registerFeature(
    owner: string,
    definition: FeatureDefinition,
  ): FeatureContribution {
    this.assertManifest(owner);
    this.assertFeatureDeclared(owner, definition.key);

    return this.features.registerForOwner(owner, definition);
  }

  registerAbility(
    owner: string,
    definition: AbilityDefinition,
  ): AbilityContribution {
    this.assertManifest(owner);
    this.assertAbilityDeclared(owner, definition.subject);

    return this.abilities.registerForOwner(owner, definition);
  }

  registerSetting(
    owner: string,
    definition: SettingDefinition,
  ): SettingContribution {
    this.assertManifest(owner);
    this.assertSettingDeclared(owner, definition.key);

    return this.settings.registerForOwner(owner, definition);
  }

  registerEventSubscriber(
    owner: string,
    event: string,
    handler: ExtensionEventHandler,
    options?: ExtensionEventSubscriptionOptions,
  ): EventSubscriberContribution {
    this.assertCapability(owner, 'events.subscribe');

    return this.events.registerForOwner(owner, event, handler, options);
  }

  removeEventSubscriber(id: string): boolean {
    return this.events.remove(id);
  }

  registerJob(
    owner: string,
    definition: ExtensionJobDefinition<any>,
  ): JobContribution {
    this.assertCapability(owner, 'jobs.register');

    return this.jobs.registerForOwner(owner, definition);
  }

  getFeatures(): FeatureContribution[] {
    return this.features.getAll();
  }

  getAbilities(): AbilityContribution[] {
    return this.abilities.getAll();
  }

  getSettings(owner?: string): SettingContribution[] {
    return owner ? this.settings.getByOwner(owner) : this.settings.getAll();
  }

  getEventSubscribers(): EventSubscriberContribution[] {
    return this.events.getAll();
  }

  getJobs(): JobContribution[] {
    return this.jobs.getAll();
  }

  /**
   * Removes every contribution owned by the extension.
   */
  removeByOwner(owner: string): void {
    this.features.removeByOwner(owner);
    this.abilities.removeByOwner(owner);
    this.settings.removeByOwner(owner);
    this.events.removeByOwner(owner);
    this.jobs.removeByOwner(owner);
    this.manifests.delete(owner);
  }

  clear(): void {
    this.features.clear();
    this.abilities.clear();
    this.settings.clear();
    this.events.clear();
    this.jobs.clear();
    this.manifests.clear();
  }

  private assertManifest(owner: string): void {
    if (!this.manifests.has(owner)) {
      throw new Error(
        `Extension "${owner}" must be registered before contributing to the host.`,
      );
    }
  }

  private assertCapability(
    owner: string,
    capability: ExtensionCapability,
  ): void {
    const manifest = this.manifests.get(owner);

    if (!manifest) {
      throw new Error(
        `Extension "${owner}" must be registered before contributing to the host.`,
      );
    }

    if (!manifest.capabilities.includes(capability)) {
      throw new ExtensionCapabilityError(owner, capability);
    }
  }

  private assertFeatureDeclared(owner: string, key: string): void {
    const manifest = this.manifests.get(owner);

    if (!manifest?.features.some((feature) => feature.key === key)) {
      throw new Error(
        `Extension "${owner}" must declare feature "${key}" in its manifest before registering it.`,
      );
    }
  }

  private assertAbilityDeclared(owner: string, subject: string): void {
    const manifest = this.manifests.get(owner);

    if (!manifest?.abilities.some((ability) => ability.subject === subject)) {
      throw new Error(
        `Extension "${owner}" must declare ability subject "${subject}" in its manifest before registering it.`,
      );
    }
  }

  private assertSettingDeclared(owner: string, key: string): void {
    const manifest = this.manifests.get(owner);

    if (!manifest?.settings.some((setting) => setting.key === key)) {
      throw new Error(
        `Extension "${owner}" must declare setting "${key}" in its manifest before registering it.`,
      );
    }
  }
}
