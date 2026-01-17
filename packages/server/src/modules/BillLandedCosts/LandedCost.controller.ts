import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AllocateBillLandedCostDto } from './dtos/AllocateBillLandedCost.dto';
import { AllocateLandedCostService } from './commands/AllocateLandedCost.service';
import { BillAllocatedLandedCostTransactions } from './commands/BillAllocatedLandedCostTransactions.service';
import { RevertAllocatedLandedCost } from './commands/RevertAllocatedLandedCost.service';
import { LandedCostTranasctions } from './commands/LandedCostTransactions.service';
import { LandedCostTransactionsQueryDto } from './dtos/LandedCostTransactionsQuery.dto';
import { ApiCommonHeaders } from '@/common/decorators/ApiCommonHeaders';

@ApiTags('Landed Cost')
@Controller('landed-cost')
@ApiCommonHeaders()
export class BillAllocateLandedCostController {
  constructor(
    private allocateLandedCost: AllocateLandedCostService,
    private billAllocatedCostTransactions: BillAllocatedLandedCostTransactions,
    private revertAllocatedLandedCost: RevertAllocatedLandedCost,
    private landedCostTransactions: LandedCostTranasctions,
  ) { }

  @Get('/transactions')
  @ApiOperation({ summary: 'Get landed cost transactions' })
  @ApiResponse({
    status: 200,
    description: 'List of landed cost transactions.',
  })
  async getLandedCostTransactions(
    @Query() query: LandedCostTransactionsQueryDto,
  ) {
    const transactions =
      await this.landedCostTransactions.getLandedCostTransactions(query);

    return transactions;
  }

  @Post('/bills/:billId/allocate')
  @ApiOperation({ summary: 'Allocate landed cost to bill items' })
  @ApiResponse({
    status: 201,
    description: 'Landed cost allocated successfully.',
  })
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
  @ApiOperation({ summary: 'Delete allocated landed cost' })
  @ApiResponse({
    status: 200,
    description: 'Allocated landed cost deleted successfully.',
  })
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

  @Get('/bills/:billId/transactions')
  @ApiOperation({ summary: 'Get bill landed cost transactions' })
  @ApiResponse({
    status: 200,
    description: 'List of bill landed cost transactions.',
  })
  async getBillLandedCostTransactions(@Param('billId') billId: number) {
    const data =
      await this.billAllocatedCostTransactions.getBillLandedCostTransactions(
        billId,
      );
    return {
      billId,
      data,
    };
  }
}
