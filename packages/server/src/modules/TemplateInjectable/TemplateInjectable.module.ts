import { Module } from '@nestjs/common';
import { TemplateInjectable } from './TemplateInjectable.service';
import { TenancyModule } from '../Tenancy/Tenancy.module';

@Module({
  imports: [TenancyModule],
  providers: [TemplateInjectable],
  exports: [TemplateInjectable],
})
export class TemplateInjectableModule {}
