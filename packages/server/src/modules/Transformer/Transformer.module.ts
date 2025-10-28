import { Global, Module } from '@nestjs/common';
import { TransformerInjectable } from './TransformerInjectable.service';
import { TenancyContext } from '../Tenancy/TenancyContext.service';

@Global()
@Module({
  providers: [TransformerInjectable, TenancyContext],
  exports: [TransformerInjectable],
  imports: [],
})
export class TransformerModule {}
