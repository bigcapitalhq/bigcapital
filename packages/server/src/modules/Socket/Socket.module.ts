import { Module } from '@nestjs/common';
import { SocketGateway } from './Socket.gateway';

@Module({
  providers: [SocketGateway],
  exports: [SocketGateway],
})
export class SocketModule { }


