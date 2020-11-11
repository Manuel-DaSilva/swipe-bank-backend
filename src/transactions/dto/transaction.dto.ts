import { IsPositive, IsString } from 'class-validator';

export class TransactionDto {
  @IsString()
  fromAccountNumber: string;

  @IsString()
  toAccountNumber: string;

  @IsPositive()
  amount: number;

  @IsString()
  description: string;
}
