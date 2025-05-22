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
import { BillPaymentsApplication } from './BillPaymentsApplication.service';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import {
  CreateBillPaymentDto,
  EditBillPaymentDto,
} from './dtos/BillPayment.dto';
import { GetBillPaymentsFilterDto } from './dtos/GetBillPaymentsFilter.dto';

@Controller('bill-payments')
@ApiTags('bill-payments')
export class BillPaymentsController {
  constructor(private billPaymentsApplication: BillPaymentsApplication) {}

  @Post()
  @ApiOperation({ summary: 'Create a new bill payment.' })
  public createBillPayment(@Body() billPaymentDTO: CreateBillPaymentDto) {
    return this.billPaymentsApplication.createBillPayment(billPaymentDTO);
  }

  @Delete(':billPaymentId')
  @ApiOperation({ summary: 'Delete the given bill payment.' })
  @ApiParam({
    name: 'billPaymentId',
    required: true,
    type: Number,
    description: 'The bill payment id',
  })
  public deleteBillPayment(@Param('billPaymentId') billPaymentId: string) {
    return this.billPaymentsApplication.deleteBillPayment(
      Number(billPaymentId),
    );
  }

  @Put(':billPaymentId')
  @ApiOperation({ summary: 'Edit the given bill payment.' })
  @ApiParam({
    name: 'billPaymentId',
    required: true,
    type: Number,
    description: 'The bill payment id',
  })
  public editBillPayment(
    @Param('billPaymentId') billPaymentId: string,
    @Body() billPaymentDTO: EditBillPaymentDto,
  ) {
    return this.billPaymentsApplication.editBillPayment(
      Number(billPaymentId),
      billPaymentDTO,
    );
  }

  @Get(':billPaymentId/bills')
  @ApiOperation({ summary: 'Retrieves the bills of the given bill payment.' })
  @ApiParam({
    name: 'billPaymentId',
    required: true,
    type: Number,
    description: 'The bill payment id',
  })
  public getPaymentBills(@Param('billPaymentId') billPaymentId: string) {
    return this.billPaymentsApplication.getPaymentBills(Number(billPaymentId));
  }

  @Get(':billPaymentId')
  @ApiOperation({ summary: 'Retrieves the bill payment details.' })
  @ApiParam({
    name: 'billPaymentId',
    required: true,
    type: Number,
    description: 'The bill payment id',
  })
  public getBillPayment(@Param('billPaymentId') billPaymentId: string) {
    return this.billPaymentsApplication.getBillPayment(Number(billPaymentId));
  }

  @Get('')
  @ApiOperation({ summary: 'Retrieves the bill payments list.' })
  public getBillPayments(@Query() filterDTO: GetBillPaymentsFilterDto) {
    return this.billPaymentsApplication.getBillPayments(filterDTO);
  }
}
