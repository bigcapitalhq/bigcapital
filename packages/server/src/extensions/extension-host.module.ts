import { DynamicModule, Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { SystemModelsModule } from '../modules/System/SystemModels/SystemModels.module';
import {
  EXTENSION_OPTIONS_TOKEN,
  EXTENSIONS_TOKEN,
} from './extension.constants';
import { ExtensionContextFactory } from './extension.context';
import { ExtensionContributionRegistry } from './extension.registry';
import { ExtensionEventBridge } from './extension.event-bridge';
import { ExtensionLifecycleService } from './extension.lifecycle.service';
import { ExtensionManager } from './extension.manager';
import type {
  ExtensionsModuleOptions,
  ValidatedExtension,
} from './extension.types';

export interface ExtensionHostModuleOptions {
  extensions: ValidatedExtension[];
  registry: ExtensionContributionRegistry;
  options: ExtensionsModuleOptions;
}

/**
 * Global host primitives for extensions.
 *
 * This module intentionally does not import feature/ability/dashboard modules;
 * those modules depend on the host, never the other way around. Keeping the
 * dependency direction one-way avoids DI cycles.
 */
@Module({})
export class ExtensionHostModule {
  static forRoot({
    extensions,
    registry,
    options,
  }: ExtensionHostModuleOptions): DynamicModule {
    return {
      module: ExtensionHostModule,
      global: true,
      imports: [DiscoveryModule, SystemModelsModule],
      providers: [
        { provide: EXTENSIONS_TOKEN, useValue: extensions },
        { provide: EXTENSION_OPTIONS_TOKEN, useValue: options },
        { provide: ExtensionContributionRegistry, useValue: registry },
        ExtensionManager,
        ExtensionContextFactory,
        ExtensionEventBridge,
        ExtensionLifecycleService,
      ],
      exports: [
        EXTENSIONS_TOKEN,
        EXTENSION_OPTIONS_TOKEN,
        ExtensionContributionRegistry,
        ExtensionManager,
        ExtensionContextFactory,
        ExtensionEventBridge,
        ExtensionLifecycleService,
      ],
    };
  }
}
