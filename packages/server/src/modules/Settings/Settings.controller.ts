import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, Put } from '@nestjs/common';
import { SettingsApplicationService } from './SettingsApplication.service';
import { ISettingsDTO } from './Settings.types';

@Controller('settings')
@ApiTags('Settings')
export class SettingsController {
  constructor(
    private readonly settingsApplicationService: SettingsApplicationService,
  ) {}

  @Put()
  @ApiOperation({ summary: 'Save the given settings.' })
  async saveSettings(@Body() settingsDTO: ISettingsDTO) {
    return this.settingsApplicationService.saveSettings(settingsDTO);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieves the settings.' })
  async getSettings() {
    return this.settingsApplicationService.getSettings();
  }
}
