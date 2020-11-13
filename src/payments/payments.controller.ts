import {
  Body,
  Controller,
  Post,
  ValidationPipe,
  Headers,
  BadRequestException,
  HttpCode,
} from '@nestjs/common';
import { CreditCardPaymentDto } from './dto/credit-card-payment.dto';
import { PaymentsService } from './payments.service';
import {
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UnauthorizedException } from '@nestjs/common';
import { PaymentResponse } from './response/payment-response.class';

@ApiTags('Pagos')
@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @ApiOperation({ summary: 'Procesar compra desde comercio' })
  @ApiOkResponse({
    description: 'Pago realizado',
    type: PaymentResponse,
  })
  @ApiResponse({ status: 400, description: 'Pago rechazado motivo banco' })
  @ApiResponse({
    status: 401,
    description: 'Pago rechazado apikey no presente o incorrecta',
  })
  @Post('credit-card')
  @HttpCode(200)
  creditCardPayment(
    @Headers('apikey') apikey: string,
    @Body(ValidationPipe) creditCardPaymentDto: CreditCardPaymentDto,
  ): Promise<PaymentResponse> {
    if (!apikey) {
      throw new UnauthorizedException(
        `'apikey' header is required, with a valid e-commerce apikey`,
      );
    }
    return this.paymentsService.creditCardPayment(creditCardPaymentDto, apikey);
  }

  @Post('bank')
  redirectedPayment(
    @Headers('apikey') apikey: string,
    @Body(ValidationPipe) creditCardPaymentDto: CreditCardPaymentDto,
  ): Promise<any> {
    if (!apikey) {
      throw new BadRequestException(`'apikey' header is required.`);
    }
    return this.paymentsService.redirectedPayment(creditCardPaymentDto, apikey);
  }
}
