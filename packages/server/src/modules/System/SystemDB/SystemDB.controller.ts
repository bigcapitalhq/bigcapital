import { Controller, Get, Post } from '@nestjs/common';

@Controller('/system_db')
export class SystemDatabaseController {
  constructor() {}

  @Post()
  @Get()
  ping(){
    
  }
}
