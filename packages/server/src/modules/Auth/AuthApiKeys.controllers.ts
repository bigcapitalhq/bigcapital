import { Controller, Post, Param, Get, Put } from '@nestjs/common';
import { GenerateApiKey } from './commands/GenerateApiKey.service';
import { GetApiKeysService } from './queries/GetApiKeys.service';

@Controller('api-keys')
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
