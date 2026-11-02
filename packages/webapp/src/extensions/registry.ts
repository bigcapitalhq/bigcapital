import type {
  BigcapitalWebExtension,
  DialogContribution,
  MenuContribution,
  RouteContribution,
  SettingsTabContribution,
} from '@bigcapital/extension-sdk/web';

export interface RegisteredRoute extends RouteContribution {
  extensionId: string;
}

export interface RegisteredMenuItem extends MenuContribution {
  extensionId: string;
}

export interface RegisteredSettingsTab extends SettingsTabContribution {
  extensionId: string;
}

export interface RegisteredDialog extends DialogContribution {
  extensionId: string;
}

type ContributionKind = 'route' | 'menu' | 'settings tab' | 'dialog';

/**
 * Resolves an extension route to its namespaced web path.
 *
 * Relative paths are mounted under `/ext/<extensionId>/`. Absolute paths that
 * already live under the extension namespace are preserved.
 */
export function resolveExtensionRoutePath(
  extensionId: string,
  path: string,
): string {
  const basePath = `/ext/${extensionId}`;
  const normalized = path.replace(/^\/+|\/+$/g, '');

  if (!normalized) {
    return basePath;
  }

  if (
    `/${normalized}` === basePath ||
    `/${normalized}`.startsWith(`${basePath}/`)
  ) {
    return `/${normalized}`;
  }

  return `${basePath}/${normalized}`;
}

/**
 * Resolves an extension settings tab to its preferences path.
 */
export function resolveExtensionSettingsPath(
  extensionId: string,
  path: string,
): string {
  const basePath = `/preferences/ext/${extensionId}`;
  const normalized = path.replace(/^\/+|\/+$/g, '');

  if (!normalized) {
    return basePath;
  }

  if (
    `/${normalized}` === basePath ||
    `/${normalized}`.startsWith(`${basePath}/`)
  ) {
    return `/${normalized}`;
  }

  return `${basePath}/${normalized}`;
}

/**
 * Resolves an extension menu href. Absolute paths are preserved; relative
 * paths use the extension route namespace.
 */
export function resolveExtensionMenuHref(
  extensionId: string,
  href?: string,
): string | undefined {
  if (!href) {
    return undefined;
  }

  if (href.startsWith('/')) {
    return href;
  }

  return resolveExtensionRoutePath(extensionId, href);
}

/**
 * Webapp-side registry of compiled extensions.
 *
 * Contributions are filtered by the tenant's enabled extension ids returned
 * from the dashboard boot metadata.
 */
export class WebExtensionRegistry {
  private readonly extensions = new Map<string, BigcapitalWebExtension>();
  private readonly routeIds = new Map<string, string>();
  private readonly routePaths = new Map<string, string>();
  private readonly menuIds = new Map<string, string>();
  private readonly settingsTabIds = new Map<string, string>();
  private readonly settingsTabPaths = new Map<string, string>();
  private readonly dialogIds = new Map<string, string>();

  register(extension: BigcapitalWebExtension): void {
    const extensionId = extension.manifest.id;

    if (this.extensions.has(extensionId)) {
      throw new Error(
        `Web extension "${extensionId}" is registered more than once.`,
      );
    }

    this.assertUniqueContributions(
      extension.routes,
      'route',
      this.routeIds,
      extensionId,
    );
    this.assertUniqueContributions(
      extension.menu,
      'menu',
      this.menuIds,
      extensionId,
    );
    this.assertUniqueContributions(
      extension.settingsTabs,
      'settings tab',
      this.settingsTabIds,
      extensionId,
    );
    this.assertUniqueContributions(
      extension.dialogs,
      'dialog',
      this.dialogIds,
      extensionId,
    );

    (extension.routes ?? []).forEach((route) => {
      const path = resolveExtensionRoutePath(extensionId, route.path);
      const owner = this.routePaths.get(path);

      if (owner) {
        throw new Error(
          `Route path "${path}" is already registered by extension "${owner}".`,
        );
      }

      this.routePaths.set(path, extensionId);
    });

    (extension.settingsTabs ?? []).forEach((tab) => {
      const path = resolveExtensionSettingsPath(extensionId, tab.path);
      const owner = this.settingsTabPaths.get(path);

      if (owner) {
        throw new Error(
          `Settings path "${path}" is already registered by extension "${owner}".`,
        );
      }

      this.settingsTabPaths.set(path, extensionId);
    });

    this.extensions.set(extensionId, extension);
  }

  registerAll(extensions: BigcapitalWebExtension[]): void {
    extensions.forEach((extension) => this.register(extension));
  }

  getExtensions(): BigcapitalWebExtension[] {
    return Array.from(this.extensions.values());
  }

  getRoutes(enabledIds: ReadonlySet<string>): RegisteredRoute[] {
    return this.collect(
      enabledIds,
      (extension) => extension.routes,
      (extension, route) => ({
        ...route,
        extensionId: extension.manifest.id,
        path: resolveExtensionRoutePath(extension.manifest.id, route.path),
      }),
    ).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }

  getMenu(enabledIds: ReadonlySet<string>): RegisteredMenuItem[] {
    return this.collect(
      enabledIds,
      (extension) => extension.menu,
      (extension, item) => ({
        ...item,
        extensionId: extension.manifest.id,
      }),
    ).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }

  getSettingsTabs(enabledIds: ReadonlySet<string>): RegisteredSettingsTab[] {
    return this.collect(
      enabledIds,
      (extension) => extension.settingsTabs,
      (extension, tab) => ({
        ...tab,
        extensionId: extension.manifest.id,
        path: resolveExtensionSettingsPath(extension.manifest.id, tab.path),
      }),
    ).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }

  getDialogs(enabledIds: ReadonlySet<string>): RegisteredDialog[] {
    return this.collect(
      enabledIds,
      (extension) => extension.dialogs,
      (extension, dialog) => ({
        ...dialog,
        extensionId: extension.manifest.id,
      }),
    );
  }

  /**
   * Flattens extension translations into the host locale map.
   *
   * Keys are prefixed with `ext.<extensionId>.` to avoid collisions.
   */
  getI18n(locale: string): Record<string, string> {
    const messages: Record<string, string> = {};

    for (const extension of this.extensions.values()) {
      const localeMessages = extension.i18n?.[locale] ?? {};

      Object.entries(localeMessages).forEach(([key, value]) => {
        messages[`ext.${extension.manifest.id}.${key}`] = value;
      });
    }

    return messages;
  }

  private collect<TContribution, TResult>(
    enabledIds: ReadonlySet<string>,
    selector: (
      extension: BigcapitalWebExtension,
    ) => TContribution[] | undefined,
    map: (
      extension: BigcapitalWebExtension,
      contribution: TContribution,
    ) => TResult,
  ): TResult[] {
    const result: TResult[] = [];

    for (const extension of this.extensions.values()) {
      if (!enabledIds.has(extension.manifest.id)) {
        continue;
      }

      (selector(extension) ?? []).forEach((contribution) => {
        result.push(map(extension, contribution));
      });
    }

    return result;
  }

  private assertUniqueContributions(
    contributions: Array<{ id: string }> | undefined,
    kind: ContributionKind,
    owners: Map<string, string>,
    extensionId: string,
  ): void {
    (contributions ?? []).forEach((contribution) => {
      const owner = owners.get(contribution.id);

      if (owner) {
        throw new Error(
          `Extension ${kind} "${contribution.id}" is already registered by "${owner}".`,
        );
      }

      owners.set(contribution.id, extensionId);
    });
  }
}

/**
 * Singleton shared by the bootstrapper and every webapp consumer.
 */
export const extensionRegistry = new WebExtensionRegistry();
