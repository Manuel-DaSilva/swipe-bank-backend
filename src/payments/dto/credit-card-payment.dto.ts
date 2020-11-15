import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsAlpha,
  IsNumberString,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
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
  @Matches(/[0-9][0-9]\/[0-9][0-9]/, {
    message: 'Date expected as mm/yy format',
  })
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
  @ApiProperty()
  description: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  commerce: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  ref: string;
}
