import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { WebhooksApplication } from './Webhooks.application';
import {
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { CreateWebhookDto, EditWebhookDto } from './dtos/Webhook.dto';
import { WebhookResponseDto } from './dtos/WebhookResponse.dto';
import { WebhookDeliveryResponseDto } from './dtos/WebhookDeliveryResponse.dto';
import { ApiCommonHeaders } from '@/common/decorators/ApiCommonHeaders';
import { RequirePermission } from '@/modules/Roles/RequirePermission.decorator';
import { PermissionGuard } from '@/modules/Roles/Permission.guard';
import { AuthorizationGuard } from '@/modules/Roles/Authorization.guard';
import { AbilitySubject } from '@/modules/Roles/Roles.types';
import { WebhookAction } from './Webhooks.types';

@Controller('webhooks')
@ApiTags('Webhooks')
@ApiExtraModels(WebhookResponseDto, WebhookDeliveryResponseDto)
@ApiCommonHeaders()
@UseGuards(AuthorizationGuard, PermissionGuard)
export class WebhooksController {
  constructor(private readonly webhooksApplication: WebhooksApplication) {}

  @Post()
  @RequirePermission(WebhookAction.Create, AbilitySubject.Webhook)
  @ApiOperation({ summary: 'Create a new webhook.' })
  @ApiResponse({
    status: 201,
    description: 'The webhook has been successfully created.',
    schema: { $ref: getSchemaPath(WebhookResponseDto) },
  })
  public createWebhook(@Body() dto: CreateWebhookDto) {
    return this.webhooksApplication.createWebhook(dto);
  }

  @Put(':id')
  @RequirePermission(WebhookAction.Edit, AbilitySubject.Webhook)
  @ApiOperation({ summary: 'Edit the given webhook.' })
  @ApiResponse({
    status: 200,
    description: 'The webhook has been successfully updated.',
    schema: { $ref: getSchemaPath(WebhookResponseDto) },
  })
  public editWebhook(
    @Param('id') webhookId: number,
    @Body() dto: EditWebhookDto,
  ) {
    return this.webhooksApplication.editWebhook(webhookId, dto);
  }

  @Delete(':id')
  @RequirePermission(WebhookAction.Delete, AbilitySubject.Webhook)
  @ApiOperation({ summary: 'Delete the given webhook.' })
  @ApiResponse({
    status: 200,
    description: 'The webhook has been successfully deleted.',
    schema: { $ref: getSchemaPath(WebhookResponseDto) },
  })
  public deleteWebhook(@Param('id') webhookId: number) {
    return this.webhooksApplication.deleteWebhook(webhookId);
  }

  @Get(':id')
  @RequirePermission(WebhookAction.View, AbilitySubject.Webhook)
  @ApiOperation({ summary: 'Retrieves the webhook details.' })
  @ApiResponse({
    status: 200,
    description: 'The webhook details have been successfully retrieved.',
    schema: { $ref: getSchemaPath(WebhookResponseDto) },
  })
  public getWebhook(@Param('id') webhookId: number) {
    return this.webhooksApplication.getWebhook(webhookId);
  }

  @Get()
  @RequirePermission(WebhookAction.View, AbilitySubject.Webhook)
  @ApiOperation({ summary: 'Retrieves the webhooks list.' })
  @ApiResponse({
    status: 200,
    description: 'The webhooks have been successfully retrieved.',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: getSchemaPath(WebhookResponseDto) },
        },
        pagination: {
          type: 'object',
          properties: {
            total: { type: 'number' },
            page: { type: 'number' },
            pageSize: { type: 'number' },
          },
        },
      },
    },
  })
  public getWebhooks(
    @Query('filter_by') filterBy?: string,
    @Query('page') page?: number,
    @Query('page_size') pageSize?: number,
  ) {
    return this.webhooksApplication.getWebhooks(filterBy, page, pageSize);
  }

  @Post(':id/toggle')
  @RequirePermission(WebhookAction.Edit, AbilitySubject.Webhook)
  @ApiOperation({ summary: 'Toggle the webhook active state.' })
  @ApiResponse({
    status: 200,
    description: 'The webhook active state has been toggled.',
    schema: { $ref: getSchemaPath(WebhookResponseDto) },
  })
  public toggleWebhookActive(@Param('id') webhookId: number) {
    return this.webhooksApplication.toggleWebhookActive(webhookId);
  }

  @Get(':id/deliveries')
  @RequirePermission(WebhookAction.View, AbilitySubject.Webhook)
  @ApiOperation({ summary: 'Retrieves the webhook delivery logs.' })
  @ApiResponse({
    status: 200,
    description: 'The delivery logs have been successfully retrieved.',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: getSchemaPath(WebhookDeliveryResponseDto) },
        },
        pagination: {
          type: 'object',
          properties: {
            total: { type: 'number' },
            page: { type: 'number' },
            pageSize: { type: 'number' },
          },
        },
      },
    },
  })
  public getWebhookDeliveries(
    @Param('id') webhookId: number,
    @Query('page') page?: number,
    @Query('page_size') pageSize?: number,
  ) {
    return this.webhooksApplication.getWebhookDeliveries(webhookId, page, pageSize);
  }
}
