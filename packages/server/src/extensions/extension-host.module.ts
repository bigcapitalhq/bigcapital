import { DynamicModule, Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { SystemModelsModule } from '../modules/System/SystemModels/SystemModels.module';
import { TenancyModelsModule } from '../modules/Tenancy/TenancyModels/Tenancy.module';
import { TenancyDatabaseModule } from '../modules/Tenancy/TenancyDB/TenancyDB.module';
import {
  ApprovalRegistry,
  ExtensionBridgeRegistries,
  PaymentRegistry,
  ReportRegistry,
  TaxRegistry,
} from './bridges';
import { ExtensionAccountingQueryService } from './bridges/reports/accounting-query.service';
import {
  EXTENSION_OPTIONS_TOKEN,
  EXTENSIONS_TOKEN,
} from './extension.constants';
import { ExtensionContextFactory } from './extension.context';
import { ExtensionContributionRegistry } from './extension.registry';
import { ExtensionEventBridge } from './extension.event-bridge';
import { ExtensionLifecycleService } from './extension.lifecycle.service';
import { ExtensionManager } from './extension.manager';
import { ExtensionMigrationService } from './migrations/extension-migration.service';
import { ExtensionSettingsService } from './settings/extension-settings.service';
import type {
  ExtensionsModuleOptions,
  ValidatedExtension,
} from './extension.types';

export interface ExtensionHostModuleOptions {
  extensions: ValidatedExtension[];
  registry: ExtensionContributionRegistry;
  bridges: ExtensionBridgeRegistries;
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
    bridges,
    options,
  }: ExtensionHostModuleOptions): DynamicModule {
    return {
      module: ExtensionHostModule,
      global: true,
      imports: [
        DiscoveryModule,
        SystemModelsModule,
        TenancyDatabaseModule,
        TenancyModelsModule,
      ],
      providers: [
        { provide: EXTENSIONS_TOKEN, useValue: extensions },
        { provide: EXTENSION_OPTIONS_TOKEN, useValue: options },
        { provide: ExtensionContributionRegistry, useValue: registry },
        { provide: ExtensionBridgeRegistries, useValue: bridges },
        { provide: ReportRegistry, useValue: bridges.reports },
        { provide: ApprovalRegistry, useValue: bridges.approvals },
        { provide: PaymentRegistry, useValue: bridges.payments },
        { provide: TaxRegistry, useValue: bridges.tax },
        ExtensionAccountingQueryService,
        ExtensionManager,
        ExtensionSettingsService,
        ExtensionMigrationService,
        ExtensionContextFactory,
        ExtensionEventBridge,
        ExtensionLifecycleService,
      ],
      exports: [
        EXTENSIONS_TOKEN,
        EXTENSION_OPTIONS_TOKEN,
        ExtensionContributionRegistry,
        ExtensionBridgeRegistries,
        ReportRegistry,
        ApprovalRegistry,
        PaymentRegistry,
        TaxRegistry,
        ExtensionAccountingQueryService,
        ExtensionManager,
        ExtensionSettingsService,
        ExtensionMigrationService,
        ExtensionContextFactory,
        ExtensionEventBridge,
        ExtensionLifecycleService,
      ],
    };
  }
}
