import { Controller, Get, HttpCode } from '@nestjs/common';
import { PublicRoute } from '@/modules/Auth/guards/jwt.guard';

@Controller('system_db')
@PublicRoute()
export class SystemDatabaseController {
  constructor() {}

  @Get()
  @HttpCode(200)
  ping() {
    return { status: 'ok' };
  }
}
