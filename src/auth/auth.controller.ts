import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCompanySignUpDto } from './dto/auth-company-signup.dto';
import { AuthPersonSignUpDto } from './dto/auth-person-signup.dto';

@Controller('auth')
export class AuthController {

    constructor(
        private authService: AuthService,
    ) {}

    @Post('/signup/person')
    personSignUp(@Body(ValidationPipe) authPersonSignUpDto: AuthPersonSignUpDto): Promise<void> {

        return this.authService.personSignUp(authPersonSignUpDto);
    }

    @Post('/signup/company')
    companySignUp(@Body(ValidationPipe) authCompanySignUpDto: AuthCompanySignUpDto): Promise<void> {

        return this.authService.companySignUp(authCompanySignUpDto);
    }
}
