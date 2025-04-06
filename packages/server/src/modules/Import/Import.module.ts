import { Module } from '@nestjs/common';
import { ImportAls } from './ImportALS';

@Module({
  providers: [ImportAls],
  exports: [ImportAls],
})
export class ImportModule {}
