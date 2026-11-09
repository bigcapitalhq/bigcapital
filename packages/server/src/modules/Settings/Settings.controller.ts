import {
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiParam,
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
import {
  EditSmsNotificationBodyDto,
  SmsNotificationAllowedVariableDto,
  SmsNotificationSettingResponseDto,
} from './dtos/SmsNotificationSettings.dto';
import { SmsNotificationsFeatureGuard } from '../SMS/SmsNotificationsFeatureGuard';

@Controller('settings')
@ApiTags('Settings')
@ApiExtraModels(
  SettingItemDto,
  SmsNotificationSettingResponseDto,
  SmsNotificationAllowedVariableDto,
)
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
  @UseGuards(SmsNotificationsFeatureGuard)
  @ApiOperation({ summary: 'Retrieves SMS notifications settings.' })
  @ApiResponse({
    status: 200,
    description: 'The SMS notifications settings list.',
    type: [SmsNotificationSettingResponseDto],
  })
  async getSmsNotifications(): Promise<SmsNotificationSettingResponseDto[]> {
    return this.smsNotificationSettingsService.getSmsNotifications();
  }

  @Get('sms-notification/:key')
  @UseGuards(SmsNotificationsFeatureGuard)
  @ApiOperation({ summary: 'Retrieves a single SMS notification setting.' })
  @ApiParam({
    name: 'key',
    required: true,
    type: String,
    description: 'The SMS notification key.',
  })
  @ApiResponse({
    status: 200,
    description: 'The SMS notification setting.',
    type: SmsNotificationSettingResponseDto,
  })
  async getSmsNotification(
    @Param('key') key: string,
  ): Promise<SmsNotificationSettingResponseDto> {
    return this.smsNotificationSettingsService.getSmsNotification(key);
  }

  @Post('sms-notification')
  @UseGuards(SmsNotificationsFeatureGuard)
  @RequirePermission(PreferencesAction.Mutate, AbilitySubject.Preferences)
  @ApiOperation({ summary: 'Edits a single SMS notification setting.' })
  @ApiBody({ type: EditSmsNotificationBodyDto })
  @ApiResponse({
    status: 201,
    description: 'The SMS notification setting.',
    type: SmsNotificationSettingResponseDto,
  })
  async editSmsNotification(
    @Body() dto: EditSmsNotificationBodyDto,
  ): Promise<SmsNotificationSettingResponseDto> {
    const { key, ...values } = dto;
    return this.smsNotificationSettingsService.editSmsNotification(key, values);
  }
}
