import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { AuthSignUpDto } from './dto/auth-signup.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtPayload } from './jwt/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import { User } from './user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(authSignUpDto: AuthSignUpDto): Promise<void> {
    return this.userRepository.signUp(authSignUpDto);
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<UserResponseDto> {
    const user = await this.userRepository.signIn(authCredentialsDto);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateUserResponse(user);
  }

  private async generateUserResponse(user: User): Promise<UserResponseDto> {
    const payload: JwtPayload = { id: user.id };
    const accessToken = await this.jwtService.signAsync(payload);
    const userResponse = UserResponseDto.fromUser(user, accessToken);

    return userResponse;
  }
}
