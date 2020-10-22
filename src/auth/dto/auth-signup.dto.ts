import { IsAlpha, IsBoolean, IsEmail, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class AuthSignUpDto {

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    @MaxLength(30)
    username: string;

    @IsString()
    @MinLength(8)
    @MaxLength(30)
    @Matches(
        /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
        {
            message: 'Password requires: 1 upper case letter, 1 lower case letter, 1 number or special character.'
        }
    )
    password: string;
}
