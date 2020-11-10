import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { CreditCardPaymentDto } from './dto/credit-card-payment.dto';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}
  @Post('credit-card')
  creditCardPayment(
    @Body(ValidationPipe) creditCardPaymentDto: CreditCardPaymentDto,
  ): Promise<any> {
    return this.paymentsService.creditCardPayment(creditCardPaymentDto);
  }
}
