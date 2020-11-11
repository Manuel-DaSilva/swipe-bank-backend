import {
  IsString,
  MinLength,
  MaxLength,
  IsNumberString,
} from 'class-validator';

export class CreateBankDto {
  @IsString()
  @MinLength(6)
  @MaxLength(30)
  name: string;

  @IsString()
  apiEndPoint: string;

  @IsNumberString()
  @MinLength(4)
  @MaxLength(4)
  code: string;

  @IsString()
  serviceApiKey: string;
}
