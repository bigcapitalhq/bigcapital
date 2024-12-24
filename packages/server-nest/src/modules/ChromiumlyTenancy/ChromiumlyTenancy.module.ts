import { Module } from '@nestjs/common';
import { ChromiumlyHtmlConvert } from './ChromiumlyHtmlConvert.service';
import { ChromiumlyTenancy } from './ChromiumlyTenancy.service';

@Module({
  providers: [ChromiumlyHtmlConvert, ChromiumlyTenancy],
})
export class ChromiumlyTenancyModule {}
