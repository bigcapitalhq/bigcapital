import { Controller, Post, Param, Get, Put } from '@nestjs/common';
import { GenerateApiKey } from './commands/GenerateApiKey.service';
import { GetApiKeysService } from './queries/GetApiKeys.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiExtraModels,
  getSchemaPath,
} from '@nestjs/swagger';
import { ApiCommonHeaders } from '@/common/decorators/ApiCommonHeaders';
import {
  ApiKeyResponseDto,
  ApiKeyRevokeResponseDto,
  ApiKeyListResponseDto,
  ApiKeyListItemDto,
} from './dtos/ApiKey.dto';

@Controller('api-keys')
@ApiTags('Api keys')
@ApiCommonHeaders()
@ApiExtraModels(
  ApiKeyResponseDto,
  ApiKeyRevokeResponseDto,
  ApiKeyListResponseDto,
)
export class AuthApiKeysController {
  constructor(
    private readonly getApiKeysService: GetApiKeysService,
    private readonly generateApiKeyService: GenerateApiKey,
  ) {}

  @Post('generate')
  @ApiOperation({ summary: 'Generate a new API key' })
  @ApiResponse({
    status: 201,
    description: 'The generated API key',
    type: ApiKeyResponseDto,
  })
  async generate() {
    return this.generateApiKeyService.generate();
  }

  @Put(':id/revoke')
  @ApiOperation({ summary: 'Revoke an API key' })
  @ApiParam({ name: 'id', type: Number, description: 'API key ID' })
  @ApiResponse({
    status: 200,
    description: 'API key revoked',
    type: ApiKeyRevokeResponseDto,
  })
  async revoke(@Param('id') id: number) {
    return this.generateApiKeyService.revoke(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all API keys for the current tenant' })
  @ApiResponse({
    status: 200,
    description: 'List of API keys',
    schema: {
      type: 'array',
      items: {
        $ref: getSchemaPath(ApiKeyListItemDto),
      },
    },
  })
  async getApiKeys() {
    const data = await this.getApiKeysService.getApiKeys();
    return data;
  }
}
