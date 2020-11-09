import { IsString, MinLength, MaxLength } from 'class-validator';

export class CreateBankDto {
  @IsString()
  @MinLength(6)
  @MaxLength(30)
  name: string;

  @IsString()
  apiEndpoint: string;

  @IsString()
  @MinLength(6)
  @MaxLength(10)
  code: string;
}
