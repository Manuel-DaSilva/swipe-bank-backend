import { Controller, Post } from '@nestjs/common';

@Controller('payments')
export class PaymentsController {
  @Post('credit-card')
  creditCardPayment() {
    return null;
  }
}
