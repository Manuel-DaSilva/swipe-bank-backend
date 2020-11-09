import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateShopDto {
  @IsNotEmpty()
  @MaxLength(30)
  name: string;
}
