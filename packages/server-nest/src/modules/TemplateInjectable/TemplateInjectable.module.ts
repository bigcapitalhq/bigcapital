import { Module } from '@nestjs/common';
import { TemplateInjectable } from './TemplateInjectable.service';

@Module({
  providers: [TemplateInjectable],
})
export class TemplateInjectableModule {}
