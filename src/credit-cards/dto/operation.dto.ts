import { IsNumber, IsPositive, IsString } from 'class-validator';

export class OperationDto {
  @IsString()
  creditCardNumber: string;

  @IsString()
  accountNumber: string;

  @IsNumber()
  @IsPositive()
  amount: number;
}
