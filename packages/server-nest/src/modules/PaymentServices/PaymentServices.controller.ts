import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Req,
  Res,
  Next,
  UsePipes,
  ValidationPipe,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { PaymentServicesApplication } from './PaymentServicesApplication';
import { PublicRoute } from '../Auth/Jwt.guard';
import { EditPaymentMethodDTO } from './types';

@ApiTags('PaymentServices')
@Controller('payment-services')
@PublicRoute()
export class PaymentServicesController {
  constructor(
    private readonly paymentServicesApp: PaymentServicesApplication,
  ) {}

  @Get('/')
  async getPaymentServicesSpecificInvoice(@Res() res: Response) {
    const paymentServices =
      await this.paymentServicesApp.getPaymentServicesForInvoice();

    return res.status(HttpStatus.OK).send({ paymentServices });
  }

  @Get('/state')
  async getPaymentMethodsState(@Res() res: Response) {
    const paymentMethodsState =
      await this.paymentServicesApp.getPaymentMethodsState();

    return res.status(HttpStatus.OK).send({ data: paymentMethodsState });
  }

  @Get('/:paymentServiceId')
  async getPaymentService(
    @Param('paymentServiceId') paymentServiceId: number,
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    const paymentService =
      await this.paymentServicesApp.getPaymentService(paymentServiceId);

    return res.status(HttpStatus.OK).send({ data: paymentService });
  }

  @Post('/:paymentMethodId')
  async updatePaymentMethod(
    @Param('paymentMethodId') paymentMethodId: number,
    @Body() updatePaymentMethodDTO: EditPaymentMethodDTO,
    @Res() res: Response,
  ) {
    await this.paymentServicesApp.editPaymentMethod(
      paymentMethodId,
      updatePaymentMethodDTO,
    );
    return res.status(HttpStatus.OK).send({
      id: paymentMethodId,
      message: 'The given payment method has been updated.',
    });
  }

  @Delete('/:paymentMethodId')
  async deletePaymentMethod(
    @Param('paymentMethodId') paymentMethodId: number,
    @Res() res: Response,
  ) {
    await this.paymentServicesApp.deletePaymentMethod(paymentMethodId);

    return res.status(HttpStatus.NO_CONTENT).send({
      id: paymentMethodId,
      message: 'The payment method has been deleted.',
    });
  }
}
