import {
  Controller,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Get,
} from '@nestjs/common';
import { BillsApplication } from './Bills.application';
import { IBillDTO, IBillEditDTO } from './Bills.types';
import { PublicRoute } from '../Auth/Jwt.guard';

@Controller('bills')
@PublicRoute()
export class BillsController {
  constructor(private billsApplication: BillsApplication) {}

  @Post()
  createBill(@Body() billDTO: IBillDTO) {
    return this.billsApplication.createBill(billDTO);
  }

  @Put(':id')
  editBill(@Param('id') billId: number, @Body() billDTO: IBillEditDTO) {
    return this.billsApplication.editBill(billId, billDTO);
  }

  @Delete(':id')
  deleteBill(@Param('id') billId: number) {
    return this.billsApplication.deleteBill(billId);
  }

  @Get(':id')
  getBill(@Param('id') billId: number) {
    return this.billsApplication.getBill(billId);
  }

  @Post(':id/open')
  openBill(@Param('id') billId: number) {
    return this.billsApplication.openBill(billId);
  }

  @Get('due')
  getDueBills(@Body('vendorId') vendorId?: number) {
    return this.billsApplication.getDueBills(vendorId);
  }
}
