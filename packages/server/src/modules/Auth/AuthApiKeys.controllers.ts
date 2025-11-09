import { Controller, Post, Param, Get, Put, Body } from '@nestjs/common';
import { GenerateApiKey } from './commands/GenerateApiKey.service';
import { GetApiKeysService } from './queries/GetApiKeys.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiExtraModels,
  getSchemaPath,
  ApiBody,
  ApiProperty,
} from '@nestjs/swagger';
import { ApiCommonHeaders } from '@/common/decorators/ApiCommonHeaders';
import {
  ApiKeyResponseDto,
  ApiKeyRevokeResponseDto,
  ApiKeyListResponseDto,
  ApiKeyListItemDto,
} from './dtos/ApiKey.dto';
import { IsString, MaxLength } from 'class-validator';
import { IsOptional } from '@/common/decorators/Validators';

class GenerateApiKeyDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  @ApiProperty({
    description: 'Optional name for the API key',
    required: false,
    example: 'My API Key',
  })
  name?: string;
}

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
  ) { }

  @Post('generate')
  @ApiOperation({ summary: 'Generate a new API key' })
  @ApiBody({ type: GenerateApiKeyDto })
  @ApiResponse({
    status: 201,
    description: 'The generated API key',
    type: ApiKeyResponseDto,
  })
  async generate(@Body() body: GenerateApiKeyDto) {
    return this.generateApiKeyService.generate(body.name);
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
