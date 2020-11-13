import {
  IsAlphanumeric,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserType } from '../user-type.enum';

export class AuthSignUpDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(30)
  @IsAlphanumeric()
  username: string;

  @IsIn([UserType.JURIDICAL, UserType.NATURAL])
  type: UserType;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @MinLength(6)
  @MaxLength(40)
  dni: string;

  @IsString()
  @MinLength(20)
  @MaxLength(200)
  address: string;

  @IsString()
  @MinLength(8)
  @MaxLength(30)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Password requires: 1 upper case letter, 1 lower case letter, 1 number or special character.',
  })
  password: string;
}
