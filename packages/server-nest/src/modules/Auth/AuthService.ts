import { Inject, Injectable } from '@nestjs/common';
import { SystemUser } from '@/modules/System/models/SystemUser';

@Injectable()
export class AuthService {
  constructor(
    @Inject(SystemUser.name)
    private readonly systemUserModel: typeof SystemUser,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.systemUserModel
      .query()
      .findOne({ email: username });

    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
