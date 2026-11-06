import 'reflect-metadata';
import { Controller, SetMetadata } from '@nestjs/common';
import { parseExtensionManifest } from '@bigcapital/extension-sdk/manifest';
import {
  EXTENSION_CONTROLLER_METADATA_KEY,
  ExtensionController,
} from '@bigcapital/extension-sdk/server';
import { validateExtensionControllers } from './extension.routes';
import { ExtensionHostController } from './extension-host.decorators';
import type { ValidatedExtension } from './extension.types';

const extensions = [
  {
    manifest: parseExtensionManifest({
      id: 'acme.reports',
      name: 'Acme Reports',
      version: '1.0.0',
      trust: 'partner',
    }),
  },
] as ValidatedExtension[];

@ExtensionController('acme.reports', 'reports')
class ReportsController {}

@Controller('invoices')
class InvoicesController {}

@ExtensionController('acme.other', 'reports')
class UnknownExtensionController {}

@Controller('wrong')
@SetMetadata(EXTENSION_CONTROLLER_METADATA_KEY, {
  extensionId: 'acme.reports',
})
class EscapingController {}

@Controller('ext/acme.reports/reports')
class UndecoratedExtensionController {}

@ExtensionHostController()
@Controller('ext/:extensionId/reports')
class HostReportController {}

describe('validateExtensionControllers', () => {
  it('accepts controllers mounted under the extension namespace', () => {
    expect(() =>
      validateExtensionControllers(
        [{ metatype: ReportsController }],
        extensions,
      ),
    ).not.toThrow();
  });

  it('ignores core controllers', () => {
    expect(() =>
      validateExtensionControllers(
        [{ metatype: InvoicesController }],
        extensions,
      ),
    ).not.toThrow();
  });

  it('rejects controllers that declare an unknown extension', () => {
    expect(() =>
      validateExtensionControllers(
        [{ metatype: UnknownExtensionController }],
        extensions,
      ),
    ).toThrow(/unknown extension/);
  });

  it('rejects controllers whose route escapes the namespace', () => {
    expect(() =>
      validateExtensionControllers(
        [{ metatype: EscapingController }],
        extensions,
      ),
    ).toThrow(/must be mounted under/);
  });

  it('rejects ext-namespaced controllers that bypass @ExtensionController', () => {
    expect(() =>
      validateExtensionControllers(
        [{ metatype: UndecoratedExtensionController }],
        extensions,
      ),
    ).toThrow(/does not use @ExtensionController/);
  });

  it('allows core host controllers mounted under ext/...', () => {
    expect(() =>
      validateExtensionControllers(
        [{ metatype: HostReportController }],
        extensions,
      ),
    ).not.toThrow();
  });
});
