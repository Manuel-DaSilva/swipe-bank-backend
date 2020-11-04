import { User } from '../user.entity';

export class UserResponseDto extends User {
  accessToken: string;

  static fromUser(user: User, accessToken: string): UserResponseDto {
    const userResponse = new UserResponseDto();

    userResponse.id = user.id;
    userResponse.email = user.email;
    userResponse.username = user.username;
    userResponse.type = user.type;
    userResponse.fullName = user.fullName;
    userResponse.dni = user.dni;
    userResponse.address = user.address;
    userResponse.accessToken = accessToken;

    return userResponse;
  }
}
