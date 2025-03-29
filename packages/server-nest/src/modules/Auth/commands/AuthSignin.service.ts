import { SystemUser } from '@/modules/System/models/SystemUser';
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthSigninDto } from '../dtos/AuthSignin.dto';

@Injectable()
export class AuthSigninService {
  constructor(
    private readonly jwtService: JwtService,

    @Inject(SystemUser.name)
    private readonly systemUserModel: typeof SystemUser,
  ) {}

  private async validate() {}

  private getUserByEmail(email: string) {
    return this.systemUserModel.query().findOne({ email });
  }

  public async signIn(signinDto: AuthSigninDto) {}
}
