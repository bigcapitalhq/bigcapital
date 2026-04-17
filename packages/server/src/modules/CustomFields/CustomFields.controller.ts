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
import { CustomFieldsApplication } from './CustomFields.application';
import {
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { CreateCustomFieldDto, EditCustomFieldDto } from './dtos/CustomField.dto';
import { CustomFieldResponseDto } from './dtos/CustomFieldResponse.dto';
import { ReorderCustomFieldsDto } from './dtos/ReorderCustomFields.dto';
import { UpdateFieldStatusDto } from './dtos/UpdateFieldStatus.dto';
import { ApiCommonHeaders } from '@/common/decorators/ApiCommonHeaders';
import { RequirePermission } from '@/modules/Roles/RequirePermission.decorator';
import { PermissionGuard } from '@/modules/Roles/Permission.guard';
import { AuthorizationGuard } from '@/modules/Roles/Authorization.guard';
import { AbilitySubject } from '@/modules/Roles/Roles.types';
import { CustomFieldAction } from './types/CustomFields.types';

@Controller('custom-fields')
@ApiTags('Custom Fields')
@ApiExtraModels(CustomFieldResponseDto)
@ApiCommonHeaders()
@UseGuards(AuthorizationGuard, PermissionGuard)
export class CustomFieldsController {
  constructor(private readonly customFieldsApplication: CustomFieldsApplication) {}

  @Post()
  @RequirePermission(CustomFieldAction.CREATE, AbilitySubject.CustomField)
  @ApiOperation({ summary: 'Create a new custom field.' })
  @ApiResponse({
    status: 201,
    description: 'The custom field has been successfully created.',
    schema: { $ref: getSchemaPath(CustomFieldResponseDto) },
  })
  public createCustomField(@Body() createCustomFieldDTO: CreateCustomFieldDto) {
    return this.customFieldsApplication.createCustomField(createCustomFieldDTO);
  }

  @Put(':id')
  @RequirePermission(CustomFieldAction.EDIT, AbilitySubject.CustomField)
  @ApiOperation({ summary: 'Edit the given custom field.' })
  @ApiResponse({
    status: 200,
    description: 'The custom field has been successfully updated.',
    schema: { $ref: getSchemaPath(CustomFieldResponseDto) },
  })
  public editCustomField(
    @Param('id') fieldId: number,
    @Body() editCustomFieldDTO: EditCustomFieldDto,
  ) {
    return this.customFieldsApplication.editCustomField(fieldId, editCustomFieldDTO);
  }

  @Delete(':id')
  @RequirePermission(CustomFieldAction.DELETE, AbilitySubject.CustomField)
  @ApiOperation({ summary: 'Delete the given custom field.' })
  @ApiResponse({
    status: 200,
    description: 'The custom field has been successfully deleted.',
    schema: { $ref: getSchemaPath(CustomFieldResponseDto) },
  })
  public deleteCustomField(@Param('id') fieldId: number) {
    return this.customFieldsApplication.deleteCustomField(fieldId);
  }

  @Get(':id')
  @RequirePermission(CustomFieldAction.VIEW, AbilitySubject.CustomField)
  @ApiOperation({ summary: 'Retrieves the custom field details.' })
  @ApiResponse({
    status: 200,
    description: 'The custom field details have been successfully retrieved.',
    schema: { $ref: getSchemaPath(CustomFieldResponseDto) },
  })
  public getCustomField(@Param('id') fieldId: number) {
    return this.customFieldsApplication.getCustomField(fieldId);
  }

  @Get()
  @RequirePermission(CustomFieldAction.VIEW, AbilitySubject.CustomField)
  @ApiOperation({ summary: 'Retrieves the custom fields.' })
  @ApiResponse({
    status: 200,
    description: 'The custom fields have been successfully retrieved.',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: getSchemaPath(CustomFieldResponseDto) },
        },
      },
    },
  })
  public getCustomFields(@Query('resource') resourceName?: string) {
    return this.customFieldsApplication.getCustomFields(resourceName);
  }

  @Post('reorder')
  @RequirePermission(CustomFieldAction.EDIT, AbilitySubject.CustomField)
  @ApiOperation({ summary: 'Reorder custom fields.' })
  @ApiResponse({
    status: 200,
    description: 'The custom fields have been successfully reordered.',
    schema: {
      type: 'array',
      items: { $ref: getSchemaPath(CustomFieldResponseDto) },
    },
  })
  public reorderCustomFields(@Body() reorderDTO: ReorderCustomFieldsDto) {
    return this.customFieldsApplication.reorderCustomFields(reorderDTO);
  }

  @Put(':id/status')
  @RequirePermission(CustomFieldAction.EDIT, AbilitySubject.CustomField)
  @ApiOperation({ summary: 'Update custom field status.' })
  @ApiResponse({
    status: 200,
    description: 'The custom field status has been successfully updated.',
    schema: { $ref: getSchemaPath(CustomFieldResponseDto) },
  })
  public updateFieldStatus(
    @Param('id') fieldId: number,
    @Body() statusDTO: UpdateFieldStatusDto,
  ) {
    return this.customFieldsApplication.updateFieldStatus(fieldId, statusDTO);
  }
}
