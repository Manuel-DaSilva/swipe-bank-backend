import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthSignUpDto } from './dto/auth-signup.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  personSignUp(
    @Body(ValidationPipe) authSignUpDto: AuthSignUpDto,
  ): Promise<void> {
    return this.authService.signUp(authSignUpDto);
  }

  @Post('/signin')
  signIn(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<UserResponseDto> {
    return this.authService.signIn(authCredentialsDto);
  }
}
