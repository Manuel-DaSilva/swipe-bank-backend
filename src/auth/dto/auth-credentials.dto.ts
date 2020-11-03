import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AuthCredentialsDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(30)
  username: string;

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(30)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password too week',
  })
  password: string;
}
