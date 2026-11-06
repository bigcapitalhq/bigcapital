import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiCommonHeaders } from '@/common/decorators/ApiCommonHeaders';
import { BankingReconciliationApplication } from './BankingReconciliationApplication.service';
import { GetBankReconciliationsQueryDto } from './dtos/GetBankReconciliationsQuery.dto';
import { CreateBankReconciliationDto } from './dtos/CreateBankReconciliation.dto';
import { UpdateBankReconciliationDto } from './dtos/UpdateBankReconciliation.dto';
import { FinishBankReconciliationDto } from './dtos/FinishBankReconciliation.dto';
import { UndoBankReconciliationDto } from './dtos/UndoBankReconciliation.dto';
import {
  BankReconciliationDetailResponseDto,
  BankReconciliationsListResponseDto,
} from './dtos/BankReconciliationMeta.dto';

@Controller('banking/reconciliations')
@ApiTags('Banking Reconciliation')
@ApiCommonHeaders()
export class BankingReconciliationController {
  constructor(private readonly application: BankingReconciliationApplication) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve the bank account reconciliations.' })
  @ApiResponse({
    status: 200,
    description: 'Reconciliations retrieved successfully.',
    type: BankReconciliationsListResponseDto,
  })
  public getBankReconciliations(
    @Query() query: GetBankReconciliationsQueryDto,
  ) {
    return this.application.getBankReconciliations(query);
  }

  @Post()
  @ApiOperation({ summary: 'Start a new bank reconciliation.' })
  @ApiResponse({
    status: 201,
    description: 'Reconciliation created successfully.',
    type: BankReconciliationDetailResponseDto,
  })
  public createBankReconciliation(
    @Body() reconciliationDTO: CreateBankReconciliationDto,
  ) {
    return this.application.createBankReconciliation(reconciliationDTO);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve the given bank reconciliation.' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Reconciliation retrieved successfully.',
    type: BankReconciliationDetailResponseDto,
  })
  public getBankReconciliation(@Param('id') reconciliationId: number) {
    return this.application.getBankReconciliation(reconciliationId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update the given bank reconciliation draft.' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Reconciliation updated successfully.',
    type: BankReconciliationDetailResponseDto,
  })
  public updateBankReconciliation(
    @Param('id') reconciliationId: number,
    @Body() reconciliationDTO: UpdateBankReconciliationDto,
  ) {
    return this.application.updateBankReconciliation(
      reconciliationId,
      reconciliationDTO,
    );
  }

  @Post(':id/finish')
  @ApiOperation({ summary: 'Finish the given bank reconciliation.' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Reconciliation completed successfully.',
    type: BankReconciliationDetailResponseDto,
  })
  public finishBankReconciliation(
    @Param('id') reconciliationId: number,
    @Body() reconciliationDTO: FinishBankReconciliationDto,
  ) {
    return this.application.finishBankReconciliation(
      reconciliationId,
      reconciliationDTO,
    );
  }

  @Post(':id/undo')
  @ApiOperation({ summary: 'Undo the given bank reconciliation.' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Reconciliation undone successfully.',
    type: BankReconciliationDetailResponseDto,
  })
  public undoBankReconciliation(
    @Param('id') reconciliationId: number,
    @Body() undoDTO: UndoBankReconciliationDto,
  ) {
    return this.application.undoBankReconciliation(reconciliationId, undoDTO);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete the given draft/voided reconciliation.' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Reconciliation deleted successfully.',
  })
  public deleteBankReconciliation(@Param('id') reconciliationId: number) {
    return this.application.deleteBankReconciliation(reconciliationId);
  }
}
