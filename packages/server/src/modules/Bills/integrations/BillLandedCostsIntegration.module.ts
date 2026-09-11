import { Module } from '@nestjs/common';
import { BillLandedCostsBridge } from './BillLandedCostsBridge';

@Module({
  providers: [BillLandedCostsBridge],
  exports: [BillLandedCostsBridge],
})
export class BillLandedCostsIntegrationModule {}
