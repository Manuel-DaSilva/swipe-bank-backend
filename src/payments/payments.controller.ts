import {
  Body,
  Controller,
  Post,
  ValidationPipe,
  Headers,
  BadRequestException,
} from '@nestjs/common';
import { CreditCardPaymentDto } from './dto/credit-card-payment.dto';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}
  @Post('credit-card')
  creditCardPayment(
    @Headers('apikey') apikey: string,
    @Body(ValidationPipe) creditCardPaymentDto: CreditCardPaymentDto,
  ): Promise<any> {
    if (!apikey) {
      throw new BadRequestException('apikey header is required');
    }
    return this.paymentsService.creditCardPayment(creditCardPaymentDto, apikey);
  }
}
