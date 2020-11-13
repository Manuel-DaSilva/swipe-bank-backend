import { ApiProperty } from '@nestjs/swagger';

export class PaymentResponse {
  @ApiProperty()
  message: string;
  @ApiProperty()
  amount: number;
  @ApiProperty()
  ref: string;
  @ApiProperty()
  description: string;
}
