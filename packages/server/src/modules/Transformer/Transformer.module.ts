import { Global, Module } from '@nestjs/common';
import { TransformerInjectable } from './TransformerInjectable.service';
import { TenancyModule } from '../Tenancy/Tenancy.module';

@Global()
@Module({
  providers: [TransformerInjectable],
  exports: [TransformerInjectable],
  imports: [TenancyModule],
})
export class TransformerModule {}
