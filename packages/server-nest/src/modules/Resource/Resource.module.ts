import { Module } from '@nestjs/common';
import { ResourceService } from './ResourceService';

@Module({
  providers: [ResourceService],
  exports: [ResourceService],
})
export class ResourceModule {}
