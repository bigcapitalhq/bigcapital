import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { ClsService } from 'nestjs-cls';
import { ReportRegistry } from '../bridges';
import { ExtensionAccountingQueryService } from '../bridges/reports/accounting-query.service';
import { namespaceProviderKey } from '../bridges/bridge.registry';
import { ExtensionHostController } from '../extension-host.decorators';

/**
 * Generic runner for extension reports.
 *
 * Report extensions only register a `ReportProvider`; they do not need their
 * own controller.
 *
 * Route: `/api/ext/<extensionId>/reports/<providerKey>/<reportId>`
 */
@ApiExcludeController()
@ExtensionHostController()
@Controller('ext/:extensionId/reports/:providerKey')
export class ExtensionReportsController {
  constructor(
    private readonly reports: ReportRegistry,
    private readonly accountingQuery: ExtensionAccountingQueryService,
    private readonly cls: ClsService,
  ) {}

  @Get(':reportId')
  async run(
    @Param('extensionId') extensionId: string,
    @Param('providerKey') providerKey: string,
    @Param('reportId') reportId: string,
    @Query() parameters: Record<string, unknown>,
  ) {
    const organizationId = this.cls.get<string>('organizationId') ?? '';
    const userId = this.cls.get<number>('userId');

    return this.reports.run(
      `${namespaceProviderKey(extensionId, providerKey)}:${reportId}`,
      {
        organizationId,
        userId,
        parameters,
        query: this.accountingQuery,
      },
    );
  }
}
