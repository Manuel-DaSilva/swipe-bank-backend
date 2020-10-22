import { IsAlpha, IsBoolean, IsOptional } from "class-validator";
import { Equal } from "typeorm";
import { AuthSignUpDto } from './auth-signup.dto';

export class AuthPersonSignUpDto extends AuthSignUpDto {

    @IsAlpha()
    firstName: string;

    @IsAlpha()
    lastName: string;

    @IsOptional()
    @IsBoolean()
    isAdmin: boolean;
}
