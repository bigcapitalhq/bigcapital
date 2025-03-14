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
    const payload = {};

    const accessToken = this.jwtService.sign(payload);

    return accessToken;
  }
}
