import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { AllocateBillLandedCostDto } from './dtos/AllocateBillLandedCost.dto';
import { AllocateLandedCostService } from './commands/AllocateLandedCost.service';
import { BillAllocatedLandedCostTransactions } from './commands/BillAllocatedLandedCostTransactions.service';
import { RevertAllocatedLandedCost } from './commands/RevertAllocatedLandedCost.service';
import { LandedCostTranasctions } from './commands/LandedCostTransactions.service';

@Controller('landed-cost')
export class BillAllocateLandedCostController {
  constructor(
    private allocateLandedCost: AllocateLandedCostService,
    private billAllocatedCostTransactions: BillAllocatedLandedCostTransactions,
    private revertAllocatedLandedCost: RevertAllocatedLandedCost,
    private landedCostTranasctions: LandedCostTranasctions,
  ) {}

  @Get('/transactions')
  async getLandedCostTransactions(
    @Query('transaction_type') transactionType: string,
  ) {
    const transactions =
      await this.landedCostTranasctions.getLandedCostTransactions(transactionType);

    return transactions;
  }

  @Post('/bills/:billId/allocate')
  public async calculateLandedCost(
    @Param('billId') billId: number,
    @Body() landedCostDTO: AllocateBillLandedCostDto,
  ) {
    const billLandedCost = await this.allocateLandedCost.allocateLandedCost(
      landedCostDTO,
      billId,
    );
    return {
      id: billLandedCost.id,
      message: 'The items cost are located successfully.',
    };
  }

  @Delete('/:allocatedLandedCostId')
  public async deleteAllocatedLandedCost(
    @Param('allocatedLandedCostId') allocatedLandedCostId: number,
  ) {
    await this.revertAllocatedLandedCost.deleteAllocatedLandedCost(
      allocatedLandedCostId,
    );

    return {
      id: allocatedLandedCostId,
      message: 'The allocated landed cost are delete successfully.',
    };
  }

  public async  listLandedCosts(
  ) {
    const transactions =
      await this.landedCostTranasctions.getLandedCostTransactions(query);

    return transactions;
  };

  @Get('/bills/:billId/transactions')
  async getBillLandedCostTransactions(@Param('billId') billId: number) {
    const transactions =
      await this.billAllocatedCostTransactions.getBillLandedCostTransactions(
        billId,
      );

    return {
      billId,
      transactions,
    };
  }
}
