import { Controller, Get } from '@nestjs/common';
import { GetDateFormatsService } from './queries/GetDateFormats.service';
import {
  ApiExtraModels,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { DateFormatResponseDto } from './dtos/DateFormatResponse.dto';

@Controller('/')
@ApiTags('misc')
@ApiExtraModels(DateFormatResponseDto)
export class MiscellaneousController {
  constructor(private readonly getDateFormatsSevice: GetDateFormatsService) {}

  @Get('/date-formats')
  @ApiResponse({
    status: 200,
    schema: {
      type: 'array',
      items: { $ref: getSchemaPath(DateFormatResponseDto) },
    },
  })
  getDateFormats() {
    return this.getDateFormatsSevice.getDateFormats();
  }
}
