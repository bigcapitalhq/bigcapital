import type { ComponentType } from 'react';
import type { ExtensionManifest } from './manifest';

/**
 * A React component contributed by an extension.
 *
 * The host wraps contributed components in an error boundary, a suspense
 * boundary, and feature/permission guards.
 */
export type ExtensionComponent<P = any> = ComponentType<P>;

export const EXTENSION_SLOT_NAMES = [
  'dashboard.widgets',
  'invoice.detail.actions',
  'invoice.detail.sidebar',
  'contact.form.fields',
  'settings.tabs',
  'app.header.actions',
  'commandPalette.commands',
] as const;

export type ExtensionSlotName = (typeof EXTENSION_SLOT_NAMES)[number];

export interface ContributionGuard {
  feature?: string;
  permission?: {
    subject: string;
    action: string;
  };
}

export interface RouteContribution extends ContributionGuard {
  id: string;
  path: string;
  component: ExtensionComponent;
  exact?: boolean;
  pageTitle?: string;
  breadcrumb?: string;
  order?: number;
}

export interface MenuContribution extends ContributionGuard {
  id: string;
  text: string | { i18n: string };
  href?: string;
  /**
   * Id of the core or extension menu item this item should be attached to.
   * The host resolves anchors deterministically and rejects unknown anchors.
   */
  parentId?: string;
  afterId?: string;
  order?: number;
  icon?: string;
  children?: MenuContribution[];
}

export interface SlotContribution<P = any> extends ContributionGuard {
  id: string;
  /**
   * One of the host slot names. The `string & {}` branch keeps autocomplete
   * while allowing future/custom slots without a breaking SDK release.
   */
  slot: ExtensionSlotName | (string & {});
  component: ExtensionComponent<P>;
  order?: number;
}

export interface SettingsTabContribution extends ContributionGuard {
  id: string;
  label: string | { i18n: string };
  path: string;
  component: ExtensionComponent;
  order?: number;
}

export interface DialogContribution {
  id: string;
  component: ExtensionComponent;
}

export interface WebExtensionLogger {
  debug(message: string, meta?: Record<string, unknown>): void;
  info(message: string, meta?: Record<string, unknown>): void;
  warn(message: string, meta?: Record<string, unknown>): void;
  error(message: string, error?: unknown, meta?: Record<string, unknown>): void;
}

/**
 * API client scoped to `/api/ext/<extensionId>`.
 *
 * Authentication and tenant headers are added by the host.
 */
export interface ExtensionApiClient {
  get<T>(
    path: string,
    options?: { query?: Record<string, unknown> },
  ): Promise<T>;
  post<T>(path: string, body?: unknown): Promise<T>;
  put<T>(path: string, body?: unknown): Promise<T>;
  delete<T>(path: string): Promise<T>;
}

export interface WebExtensionContext {
  readonly extensionId: string;
  readonly extensionVersion: string;
  readonly logger: WebExtensionLogger;
  readonly api: ExtensionApiClient;
  readonly navigate: (path: string) => void;
}

/**
 * A webapp extension compiled into the host bundle.
 *
 * Contributions are registered at bootstrap and filtered at runtime by the
 * tenant's enabled-extension list returned from the boot endpoint.
 */
export interface BigcapitalWebExtension {
  readonly manifest: ExtensionManifest;
  routes?: RouteContribution[];
  menu?: MenuContribution[];
  slots?: SlotContribution[];
  settingsTabs?: SettingsTabContribution[];
  dialogs?: DialogContribution[];
  i18n?: Record<string, Record<string, string>>;
  onInit?(ctx: WebExtensionContext): void | Promise<void>;
}
