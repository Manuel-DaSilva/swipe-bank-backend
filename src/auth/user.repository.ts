import { EntityRepository, Repository } from 'typeorm';
import { AuthSignUpDto } from './dto/auth-signup.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(authSignUpDto: AuthSignUpDto): Promise<void> {
    const user = new User();

    user.email = authSignUpDto.email;
    user.username = authSignUpDto.username;
    user.type = authSignUpDto.type;
    user.fullName = authSignUpDto.fullName;
    user.dni = authSignUpDto.dni;
    user.address = authSignUpDto.address;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(authSignUpDto.password, user.salt);

    try {
      await user.save();
    } catch (e) {
      console.log(e);
      throw new ConflictException('An user with those values already exists');
    }
  }

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<User> {
    const { username, password } = authCredentialsDto;
    const user = await this.findOne({ username });

    if (user && (await user.validatePassword(password))) {
      // if user is valid, delete password and salt to return user
      delete user.password;
      delete user.salt;

      return user;
    } else {
      return null;
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
