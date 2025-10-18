import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  namespace: '/',
  path: '/socket',
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('SocketGateway');

  afterInit(server: Server) {
    this.logger.log('Socket.IO Gateway initialized');
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  // Method to emit NEW_TRANSACTIONS_DATA event
  emitNewTransactionsData() {
    this.server.emit('NEW_TRANSACTIONS_DATA');
    this.logger.log('Emitted NEW_TRANSACTIONS_DATA event');
  }

  // Method to emit SUBSCRIPTION_CHANGED event
  emitSubscriptionChanged() {
    this.server.emit('SUBSCRIPTION_CHANGED');
    this.logger.log('Emitted SUBSCRIPTION_CHANGED event');
  }
}


