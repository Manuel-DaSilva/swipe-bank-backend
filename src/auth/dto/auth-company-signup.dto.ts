import { IsString } from "class-validator";
import { AuthSignUpDto } from './auth-signup.dto';

export class AuthCompanySignUpDto extends AuthSignUpDto {

    @IsString()
    companyName: string;
}
