import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { SettingsApplicationService } from './SettingsApplication.service';
import { ISettingsDTO } from './Settings.types';
import { PublicRoute } from '../Auth/Jwt.guard';

@Controller('settings')
@PublicRoute()
export class SettingsController {
  constructor(
    private readonly settingsApplicationService: SettingsApplicationService,
  ) {}

  @Put('')
  async saveSettings(@Body() settingsDTO: ISettingsDTO) {
    return this.settingsApplicationService.saveSettings(settingsDTO);
  }

  @Get('')
  async getSettings() {
    return this.settingsApplicationService.getSettings();
  }
}
