import { EntityRepository, Repository } from "typeorm";
import { AuthCompanySignUpDto } from "./dto/auth-company-signup.dto";
import { AuthPersonSignUpDto } from "./dto/auth-person-signup.dto";
import { User } from "./user.entity";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    

    async companySignUp(authCompanySignUpDto: AuthCompanySignUpDto): Promise<void> {

        const user = new User();

        this.buildBaseUSer(user, authCompanySignUpDto);
        user.companyName = authCompanySignUpDto.companyName ?? null;
        user.isCompany = true;
        
        await user.save();
    }

    async personSignUp(authPersonSignUpDto: AuthPersonSignUpDto): Promise<void> {

        const user = new User();

        this.buildBaseUSer(user, authPersonSignUpDto);

        user.firstName = authPersonSignUpDto.firstName ?? null;
        user.lastName = authPersonSignUpDto.lastName ?? null;
        user.isAdmin = authPersonSignUpDto.isAdmin;
        user.isCompany = false;
        await user.save();
    }

    private buildBaseUSer(user: User, authDto: AuthCompanySignUpDto | AuthPersonSignUpDto ): void {

        user.email = authDto.email;
        user.username = authDto.username;
        user.password = authDto.username;
        user.salt = '';
    }
}
