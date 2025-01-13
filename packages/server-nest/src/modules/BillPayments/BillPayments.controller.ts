import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { BillPaymentsApplication } from './BillPaymentsApplication.service';
import { IBillPaymentDTO } from './types/BillPayments.types';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('bill-payments')
@ApiTags('bill-payments')
export class BillPaymentsController {
  constructor(private billPaymentsApplication: BillPaymentsApplication) {}

  @Post()
  @ApiOperation({ summary: 'Create a new bill payment.' })
  public createBillPayment(@Body() billPaymentDTO: IBillPaymentDTO) {
    return this.billPaymentsApplication.createBillPayment(billPaymentDTO);
  }

  @Delete(':billPaymentId')
  @ApiOperation({ summary: 'Delete the given bill payment.' })
  public deleteBillPayment(@Param('billPaymentId') billPaymentId: string) {
    return this.billPaymentsApplication.deleteBillPayment(
      Number(billPaymentId),
    );
  }

  @Put(':billPaymentId')
  @ApiOperation({ summary: 'Edit the given bill payment.' })
  public editBillPayment(
    @Param('billPaymentId') billPaymentId: string,
    @Body() billPaymentDTO: IBillPaymentDTO,
  ) {
    return this.billPaymentsApplication.editBillPayment(
      Number(billPaymentId),
      billPaymentDTO,
    );
  }

  @Get(':billPaymentId')
  @ApiOperation({ summary: 'Retrieves the bill payment details.' })
  public getBillPayment(@Param('billPaymentId') billPaymentId: string) {
    return this.billPaymentsApplication.getBillPayment(Number(billPaymentId));
  }

  @Get(':billPaymentId/bills')
  @ApiOperation({ summary: 'Retrieves the bills of the given bill payment.' })
  public getPaymentBills(@Param('billPaymentId') billPaymentId: string) {
    return this.billPaymentsApplication.getPaymentBills(Number(billPaymentId));
  }
}
