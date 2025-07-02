import { Controller, Post, Param, Get, Put } from '@nestjs/common';
import { GenerateApiKey } from './commands/GenerateApiKey.service';
import { GetApiKeysService } from './queries/GetApiKeys.service';
import { ApiExcludeController, ApiTags } from '@nestjs/swagger';
import { ApiCommonHeaders } from '@/common/decorators/ApiCommonHeaders';

@Controller('api-keys')
@ApiTags('Api keys')
@ApiCommonHeaders()
export class AuthApiKeysController {
  constructor(
    private readonly getApiKeysService: GetApiKeysService,
    private readonly generateApiKeyService: GenerateApiKey,
  ) {}

  @Post('generate')
  async generate() {
    return this.generateApiKeyService.generate();
  }

  @Put(':id/revoke')
  async revoke(@Param('id') id: number) {
    return this.generateApiKeyService.revoke(id);
  }

  @Get()
  async getApiKeys() {
    return this.getApiKeysService.getApiKeys();
  }
}
