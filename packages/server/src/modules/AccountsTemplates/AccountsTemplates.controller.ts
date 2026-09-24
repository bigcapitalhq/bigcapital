import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { ApiCommonHeaders } from '@/common/decorators/ApiCommonHeaders';
import { AuthorizationGuard } from '@/modules/Roles/Authorization.guard';
import { PermissionGuard } from '@/modules/Roles/Permission.guard';
import { RequirePermission } from '@/modules/Roles/RequirePermission.decorator';
import { AbilitySubject } from '@/modules/Roles/Roles.types';
import { AccountAction } from '../Accounts/Accounts.types';
import { PreferencesAction } from '../Settings/Settings.types';
import { ApplyAccountsTemplateGuard } from './ApplyAccountsTemplate.guard';
import { ApplyAccountsTemplateService } from './ApplyAccountsTemplate.service';
import { PreviewAccountsTemplateService } from './PreviewAccountsTemplate.service';
import {
  AccountsTemplateDto,
  AccountsTemplatePlanDto,
  AccountsTemplateVariantQueryDto,
  ApplyAccountsTemplateDto,
} from './dtos/AccountsTemplates.dto';

@Controller('accounts-templates')
@ApiTags('Accounts Templates')
@ApiExtraModels(AccountsTemplateDto, AccountsTemplatePlanDto)
@ApiCommonHeaders()
@UseGuards(AuthorizationGuard, PermissionGuard)
export class AccountsTemplatesController {
  constructor(
    private readonly previewService: PreviewAccountsTemplateService,
    private readonly applyService: ApplyAccountsTemplateService,
  ) {}

  @Get()
  @RequirePermission(AccountAction.VIEW, AbilitySubject.Account)
  @ApiOperation({ summary: 'Retrieves the chart of accounts templates.' })
  @ApiResponse({
    status: 200,
    schema: {
      type: 'array',
      items: { $ref: getSchemaPath(AccountsTemplateDto) },
    },
  })
  getTemplates(): AccountsTemplateDto[] {
    return this.previewService.getTemplates().map((template) => ({
      key: template.key,
      name: template.name,
      description: template.description,
      country: template.country,
      variants: (template.variants ?? []).map((variant) => ({
        key: variant.key,
        name: variant.name,
        description: variant.description,
      })),
    }));
  }

  @Get(':templateKey/preview')
  @RequirePermission(AccountAction.VIEW, AbilitySubject.Account)
  @ApiOperation({
    summary:
      'Previews the changes applying the template would make to the chart of accounts. Writes nothing.',
  })
  @ApiParam({ name: 'templateKey', type: String, example: 'united-states' })
  @ApiResponse({
    status: 200,
    schema: { $ref: getSchemaPath(AccountsTemplatePlanDto) },
  })
  previewTemplate(
    @Param('templateKey') templateKey: string,
    @Query() query: AccountsTemplateVariantQueryDto,
  ): Promise<AccountsTemplatePlanDto> {
    return this.previewService.preview(templateKey, query.variant);
  }

  @Post(':templateKey/apply')
  @HttpCode(200)
  @RequirePermission(PreferencesAction.Mutate, AbilitySubject.Preferences)
  @UseGuards(ApplyAccountsTemplateGuard)
  @ApiOperation({
    summary:
      'Applies the template to the chart of accounts in one transaction and returns the changes made.',
  })
  @ApiParam({ name: 'templateKey', type: String, example: 'united-states' })
  @ApiResponse({
    status: 200,
    schema: { $ref: getSchemaPath(AccountsTemplatePlanDto) },
  })
  @ApiResponse({
    status: 400,
    description:
      'ACCOUNTS_TEMPLATE_CANNOT_BE_APPLIED, with the blocking conflicts in the error payload.',
  })
  @ApiResponse({
    status: 403,
    description:
      'Requires editing preferences and creating, editing and deleting accounts.',
  })
  applyTemplate(
    @Param('templateKey') templateKey: string,
    @Body() dto: ApplyAccountsTemplateDto,
  ): Promise<AccountsTemplatePlanDto> {
    return this.applyService.apply(templateKey, dto.variant);
  }
}
