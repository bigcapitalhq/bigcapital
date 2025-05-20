import { Controller, Get } from '@nestjs/common';
import { GetDateFormatsService } from './queries/GetDateFormats.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('/')
@ApiTags('misc')
export class MiscellaneousController {
  constructor(private readonly getDateFormatsSevice: GetDateFormatsService) {}

  @Get('/date-formats')
  getDateFormats() {
    return this.getDateFormatsSevice.getDateFormats();
  }
}
