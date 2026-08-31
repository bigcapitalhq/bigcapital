import {
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { SettingsApplicationService } from './SettingsApplication.service';
import { ISettingsDTO, PreferencesAction } from './Settings.types';
import { SmsNotificationSettingsService } from './SmsNotificationSettings.service';
import { RequirePermission } from '@/modules/Roles/RequirePermission.decorator';
import { PermissionGuard } from '@/modules/Roles/Permission.guard';
import { AuthorizationGuard } from '@/modules/Roles/Authorization.guard';
import { AbilitySubject } from '@/modules/Roles/Roles.types';
import { SettingItemDto } from './dtos/SettingsResponse.dto';

@Controller('settings')
@ApiTags('Settings')
@ApiExtraModels(SettingItemDto)
@UseGuards(AuthorizationGuard, PermissionGuard)
export class SettingsController {
  constructor(
    private readonly settingsApplicationService: SettingsApplicationService,
    private readonly smsNotificationSettingsService: SmsNotificationSettingsService,
  ) {}

  @Put()
  @RequirePermission(PreferencesAction.Mutate, AbilitySubject.Preferences)
  @ApiOperation({ summary: 'Save the given settings.' })
  async saveSettings(@Body() settingsDTO: ISettingsDTO) {
    return this.settingsApplicationService.saveSettings(settingsDTO);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieves the settings.' })
  @ApiResponse({
    status: 200,
    description: 'The settings list.',
    schema: {
      type: 'array',
      items: { $ref: getSchemaPath(SettingItemDto) },
    },
  })
  async getSettings() {
    return this.settingsApplicationService.getSettings();
  }

  @Get('sms-notifications')
  @ApiOperation({ summary: 'Retrieves SMS notifications settings.' })
  async getSmsNotifications() {
    return this.smsNotificationSettingsService.getSmsNotifications();
  }

  @Get('sms-notification/:key')
  @ApiOperation({ summary: 'Retrieves a single SMS notification setting.' })
  async getSmsNotification(@Param('key') key: string) {
    return this.smsNotificationSettingsService.getSmsNotification(key);
  }

  @Post('sms-notification')
  @RequirePermission(PreferencesAction.Mutate, AbilitySubject.Preferences)
  @ApiOperation({ summary: 'Edits a single SMS notification setting.' })
  async editSmsNotification(
    @Body('key') key: string,
    @Body() dto: Record<string, unknown>,
  ) {
    const { key: _key, ...values } = dto;
    return this.smsNotificationSettingsService.editSmsNotification(key, values);
  }
}
