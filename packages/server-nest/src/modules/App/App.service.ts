import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AppService {
  // configService: ConfigService;

  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  getHello(): string {
    console.log(this.configService.get('DATABASE_PORT'));
    const payload = {};

    const accessToken = this.jwtService.sign(payload);

    console.log(accessToken);

    return accessToken;
  }
}
