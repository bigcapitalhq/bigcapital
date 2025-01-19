import { Module } from '@nestjs/common';
import { TransactionsByReferenceApplication } from './TransactionsByReferenceApplication';
import { TransactionsByReferenceRepository } from './TransactionsByReferenceRepository';
import { TransactionsByReferenceService } from './TransactionsByReference.service';
import { TransactionsByReferenceController } from './TransactionsByReference.controller';

@Module({
  providers: [
    TransactionsByReferenceRepository,
    TransactionsByReferenceApplication,
    TransactionsByReferenceService,
  ],
  controllers: [TransactionsByReferenceController],
})
export class TransactionsByReferenceModule {}
