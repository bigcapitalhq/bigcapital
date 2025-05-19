import { Module } from '@nestjs/common';
import { GetDateFormatsService } from './queries/GetDateFormats.service';
import { MiscellaneousController } from './Miscellaneous.controller';

@Module({
  providers: [GetDateFormatsService],
  exports: [GetDateFormatsService],
  controllers: [MiscellaneousController],
})
export class MiscellaneousModule {}
