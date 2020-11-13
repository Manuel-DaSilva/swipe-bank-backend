import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty()
  creditCardNumber: string;

  @IsString()
  @MaxLength(5)
  @MinLength(5)
  @ApiProperty({
    description: `'mm/yy' format`,
  })
  creditCardExpirationDate: string;

  @IsNumberString()
  @MaxLength(4)
  @MinLength(4)
  @ApiProperty()
  creditCardSecurityCode: string;

  @IsString()
  @ApiProperty()
  creditCardName: string;

  @IsPositive()
  @ApiProperty()
  amount: number;

  @IsString()
  @IsAlpha()
  @ApiProperty()
  description: string;
}
