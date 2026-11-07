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
import {
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { ApiCommonHeaders } from '@/common/decorators/ApiCommonHeaders';
import { RequirePermission } from '@/modules/Roles/RequirePermission.decorator';
import { PermissionGuard } from '@/modules/Roles/Permission.guard';
import { AuthorizationGuard } from '@/modules/Roles/Authorization.guard';
import { AbilitySubject } from '@/modules/Roles/Roles.types';
import { PreferencesAction } from '@/modules/Settings/Settings.types';
import { CustomFieldsApplication } from './CustomFieldsApplication.service';
import {
  CreateCustomFieldDto,
  EditCustomFieldDto,
  GetCustomFieldsQueryDto,
  ReorderCustomFieldsDto,
  UpdateCustomFieldStatusDto,
} from './dtos/CustomField.dto';
import {
  CustomFieldResponseDto,
  CustomFieldsListResponseDto,
} from './dtos/CustomFieldResponse.dto';

@Controller('custom-fields')
@ApiTags('Custom Fields')
@ApiExtraModels(CustomFieldResponseDto)
@ApiExtraModels(CustomFieldsListResponseDto)
@ApiCommonHeaders()
@UseGuards(AuthorizationGuard, PermissionGuard)
export class CustomFieldsController {
  constructor(
    private readonly customFieldsApplication: CustomFieldsApplication,
  ) {}

  @Post()
  @RequirePermission(PreferencesAction.Mutate, AbilitySubject.Preferences)
  @ApiOperation({ summary: 'Creates a new custom field.' })
  @ApiResponse({
    status: 201,
    description: 'The custom field has been successfully created.',
    schema: { $ref: getSchemaPath(CustomFieldResponseDto) },
  })
  public createCustomField(@Body() createCustomFieldDTO: CreateCustomFieldDto) {
    return this.customFieldsApplication.createCustomField(createCustomFieldDTO);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieves the custom fields list.' })
  @ApiResponse({
    status: 200,
    description: 'The custom fields have been successfully retrieved.',
    schema: { $ref: getSchemaPath(CustomFieldsListResponseDto) },
  })
  public getCustomFields(@Query() query: GetCustomFieldsQueryDto) {
    return this.customFieldsApplication.getCustomFields(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieves the given custom field details.' })
  @ApiParam({ name: 'id', description: 'Custom field id.' })
  @ApiResponse({
    status: 200,
    description: 'The custom field has been successfully retrieved.',
    schema: { $ref: getSchemaPath(CustomFieldResponseDto) },
  })
  public getCustomField(@Param('id') customFieldId: number) {
    return this.customFieldsApplication.getCustomField(customFieldId);
  }

  @Put(':id')
  @RequirePermission(PreferencesAction.Mutate, AbilitySubject.Preferences)
  @ApiOperation({ summary: 'Edits the given custom field.' })
  @ApiParam({ name: 'id', description: 'Custom field id.' })
  @ApiResponse({
    status: 200,
    description: 'The custom field has been successfully updated.',
    schema: { $ref: getSchemaPath(CustomFieldResponseDto) },
  })
  public editCustomField(
    @Param('id') customFieldId: number,
    @Body() editCustomFieldDTO: EditCustomFieldDto,
  ) {
    return this.customFieldsApplication.editCustomField(
      customFieldId,
      editCustomFieldDTO,
    );
  }

  @Put(':id/status')
  @RequirePermission(PreferencesAction.Mutate, AbilitySubject.Preferences)
  @ApiOperation({ summary: 'Activates or deactivates the given custom field.' })
  @ApiParam({ name: 'id', description: 'Custom field id.' })
  @ApiResponse({
    status: 200,
    description: 'The custom field status has been successfully updated.',
    schema: { $ref: getSchemaPath(CustomFieldResponseDto) },
  })
  public updateCustomFieldStatus(
    @Param('id') customFieldId: number,
    @Body() updateCustomFieldStatusDTO: UpdateCustomFieldStatusDto,
  ) {
    return this.customFieldsApplication.updateCustomFieldStatus(
      customFieldId,
      updateCustomFieldStatusDTO,
    );
  }

  @Post('reorder')
  @RequirePermission(PreferencesAction.Mutate, AbilitySubject.Preferences)
  @ApiOperation({ summary: 'Reorders custom fields.' })
  @ApiResponse({
    status: 200,
    description: 'The custom fields have been successfully reordered.',
    schema: {
      type: 'array',
      items: { $ref: getSchemaPath(CustomFieldResponseDto) },
    },
  })
  public reorderCustomFields(
    @Body() reorderCustomFieldsDTO: ReorderCustomFieldsDto,
  ) {
    return this.customFieldsApplication.reorderCustomFields(
      reorderCustomFieldsDTO,
    );
  }

  @Delete(':id')
  @RequirePermission(PreferencesAction.Mutate, AbilitySubject.Preferences)
  @ApiOperation({ summary: 'Deletes the given custom field.' })
  @ApiParam({ name: 'id', description: 'Custom field id.' })
  @ApiQuery({
    name: 'force',
    required: false,
    description: 'Force delete the field and all stored values.',
  })
  @ApiResponse({
    status: 200,
    description: 'The custom field has been successfully deleted.',
    schema: { $ref: getSchemaPath(CustomFieldResponseDto) },
  })
  public deleteCustomField(
    @Param('id') customFieldId: number,
    @Query('force') force?: string,
  ) {
    return this.customFieldsApplication.deleteCustomField(customFieldId, {
      force: force === 'true' || force === '1',
    });
  }
}
