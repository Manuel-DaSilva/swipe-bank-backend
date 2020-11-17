import { IsNumber, IsPositive, IsString } from 'class-validator';

export class WithdrawDto {
  @IsString()
  accountNumber: string;

  @IsNumber()
  @IsPositive()
  amount: number;
}
