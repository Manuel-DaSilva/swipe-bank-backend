import {
  IsAlpha,
  IsNumberString,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreditCardPaymentDto {
  @IsNumberString()
  creditCardNumber: string;

  @IsString()
  @MaxLength(4)
  @MinLength(4)
  creditCardExpirationDate: string;

  @IsNumberString()
  @MaxLength(4)
  @MinLength(4)
  creditCardSecurityCode: string;

  @IsString()
  creditCardName: string;

  @IsPositive()
  amount: number;

  @IsString()
  @IsAlpha()
  description: string;
}
