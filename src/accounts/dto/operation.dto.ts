import { IsNumber, IsPositive, IsString } from 'class-validator';

export class OperationDto {
  @IsString()
  accountNumber: string;

  @IsNumber()
  @IsPositive()
  amount: number;
}
