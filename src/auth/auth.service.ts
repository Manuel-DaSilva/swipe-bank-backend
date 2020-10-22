import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCompanySignUpDto } from './dto/auth-company-signup.dto';
import { AuthPersonSignUpDto } from './dto/auth-person-signup.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository
    ) {}

    async personSignUp(authPersonSignUpDto: AuthPersonSignUpDto): Promise<void> {
        return this.userRepository.personSignUp(authPersonSignUpDto);
    }

    async companySignUp(authCompanySignUpDto: AuthCompanySignUpDto): Promise<void> {
        return this.userRepository.companySignUp(authCompanySignUpDto);
    }
}
