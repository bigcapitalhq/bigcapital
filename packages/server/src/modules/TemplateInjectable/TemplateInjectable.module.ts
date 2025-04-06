import { Module } from '@nestjs/common';
import { TemplateInjectable } from './TemplateInjectable.service';
import { TenancyContext } from '../Tenancy/TenancyContext.service';

@Module({
  providers: [TemplateInjectable, TenancyContext],
  exports: [TemplateInjectable]
})
export class TemplateInjectableModule {}
