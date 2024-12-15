import { Global, Module } from '@nestjs/common';
import { TransformerInjectable } from './TransformerInjectable.service';
import { TenancyContext } from '../Tenancy/TenancyContext.service';

@Global()
@Module({
  providers: [TransformerInjectable],
  exports: [TransformerInjectable],
  imports: [TenancyContext],
})
export class TransformerModule {}
