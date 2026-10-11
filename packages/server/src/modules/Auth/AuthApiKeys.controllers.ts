import {
  Controller,
  Post,
  Param,
  Get,
  Put,
  Body,
  UseGuards,
} from '@nestjs/common';
import { GenerateApiKey } from './commands/GenerateApiKey.service';
import { GetApiKeysService } from './queries/GetApiKeys.service';
import { AuthorizationGuard } from '@/modules/Roles/Authorization.guard';
import { PermissionGuard } from '@/modules/Roles/Permission.guard';
import { RequirePermission } from '@/modules/Roles/RequirePermission.decorator';
import { AbilitySubject, ApiKeyAction } from '@/modules/Roles/Roles.types';
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
@UseGuards(AuthorizationGuard, PermissionGuard)
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
  @RequirePermission(ApiKeyAction.Create, AbilitySubject.ApiKey)
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
  @RequirePermission(ApiKeyAction.Revoke, AbilitySubject.ApiKey)
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
  @RequirePermission(ApiKeyAction.View, AbilitySubject.ApiKey)
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
