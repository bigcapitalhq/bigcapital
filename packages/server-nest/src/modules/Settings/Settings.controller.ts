import { Body, Controller, Get, Post } from '@nestjs/common';
import { SettingsApplicationService } from './SettingsApplication.service';
import { ISettingsDTO } from './Settings.types';
import { PublicRoute } from '../Auth/Jwt.guard';

@Controller('settings')
@PublicRoute()
export class SettingsController {
  constructor(
    private readonly settingsApplicationService: SettingsApplicationService,
  ) {}

  @Post('')
  async saveSettings(@Body() settingsDTO: ISettingsDTO) {
    return this.settingsApplicationService.saveSettings(settingsDTO);
  }

  @Get('')
  async getSettings() {}
}
