import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { SettingsApplicationService } from './SettingsApplication.service';
import { ISettingsDTO } from './Settings.types';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('settings')
@ApiTags('settings')
export class SettingsController {
  constructor(
    private readonly settingsApplicationService: SettingsApplicationService,
  ) {}

  @Put('')
  @ApiOperation({ summary: 'Save the given settings.' })
  async saveSettings(@Body() settingsDTO: ISettingsDTO) {
    return this.settingsApplicationService.saveSettings(settingsDTO);
  }

  @Get('')
  @ApiOperation({ summary: 'Retrieves the settings.' })
  async getSettings() {
    return this.settingsApplicationService.getSettings();
  }
}
