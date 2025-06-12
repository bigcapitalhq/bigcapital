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
import { BillPaymentsPages } from './commands/BillPaymentsPages.service';

@Controller('bill-payments')
@ApiTags('Bill Payments')
export class BillPaymentsController {
  constructor(
    private billPaymentsApplication: BillPaymentsApplication,
    private billPaymentsPagesService: BillPaymentsPages,
  ) {}

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

  @Get('/new-page/entries')
  @ApiOperation({
    summary:
      'Retrieves the payable entries of the new page once vendor be selected.',
  })
  @ApiParam({
    name: 'vendorId',
    required: true,
    type: Number,
    description: 'The vendor id',
  })
  async getBillPaymentNewPageEntries(@Query('vendorId') vendorId: number) {
    const entries =
      await this.billPaymentsPagesService.getNewPageEntries(vendorId);

    return entries;
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

  @Get('/:billPaymentId/edit-page')
  @ApiOperation({
    summary: 'Retrieves the edit page of the given bill payment.',
  })
  @ApiParam({
    name: 'billPaymentId',
    required: true,
    type: Number,
    description: 'The bill payment id',
  })
  public async getBillPaymentEditPage(
    @Param('billPaymentId') billPaymentId: number,
  ) {
    const billPaymentsWithEditEntries =
      await this.billPaymentsPagesService.getBillPaymentEditPage(billPaymentId);

    return billPaymentsWithEditEntries;
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

  @Get()
  @ApiOperation({ summary: 'Retrieves the bill payments list.' })
  @ApiParam({
    name: 'filterDTO',
    required: true,
    type: GetBillPaymentsFilterDto,
    description: 'The bill payments filter dto',
  })
  public getBillPayments(@Query() filterDTO: GetBillPaymentsFilterDto) {
    return this.billPaymentsApplication.getBillPayments(filterDTO);
  }
}
