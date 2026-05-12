import { Controller, Get } from '@nestjs/common';
import { PublicRoute } from '../Auth/guards/jwt.guard';

@PublicRoute()
@Controller('/health')
export class HealthController {
  @Get()
  health() {
    return {
      ok: true,
      sha: process.env.GIT_SHA ?? 'unknown',
    };
  }
}
