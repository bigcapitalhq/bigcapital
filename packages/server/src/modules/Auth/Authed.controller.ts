import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetAuthenticatedAccount } from './queries/GetAuthedAccount.service';
import { Controller, Get } from '@nestjs/common';
import { IgnoreTenantSeededRoute } from '../Tenancy/EnsureTenantIsSeeded.guards';
import { IgnoreTenantInitializedRoute } from '../Tenancy/EnsureTenantIsInitialized.guard';

@Controller('/auth')
@ApiTags('Auth')
@IgnoreTenantSeededRoute()
@IgnoreTenantInitializedRoute()
export class AuthedController {
  constructor(
    private readonly getAuthedAccountService: GetAuthenticatedAccount,
  ) {}

  @Get('/account')
  @ApiOperation({ summary: 'Retrieve the authenticated account' })
  async getAuthedAcccount() {
    const data = await this.getAuthedAccountService.getAccount();

    return { data };
  }
}
