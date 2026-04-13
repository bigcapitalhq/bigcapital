import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
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

  /**
   * Handle user joining their personal room for targeted notifications.
   * @param {Socket} client - Socket client
   * @param {Object} payload - Payload containing userId
   */
  @SubscribeMessage('join-user-room')
  handleJoinUserRoom(client: Socket, payload: { userId: number }) {
    const { userId } = payload;
    if (userId) {
      const roomName = `user:${userId}`;
      client.join(roomName);
      this.logger.log(`Client ${client.id} joined room ${roomName}`);
    }
  }

  /**
   * Handle user leaving their personal room.
   * @param {Socket} client - Socket client
   * @param {Object} payload - Payload containing userId
   */
  @SubscribeMessage('leave-user-room')
  handleLeaveUserRoom(client: Socket, payload: { userId: number }) {
    const { userId } = payload;
    if (userId) {
      const roomName = `user:${userId}`;
      client.leave(roomName);
      this.logger.log(`Client ${client.id} left room ${roomName}`);
    }
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

  /**
   * Emits a notification event to specific user or broadcasts to all.
   * @param {number | null} userId - Target user ID (null for broadcast)
   * @param {any} notification - Notification payload
   */
  emitNotification(userId: number | null, notification: any) {
    if (userId) {
      // Emit to specific user's room
      const roomName = `user:${userId}`;
      this.server.to(roomName).emit('NOTIFICATION', notification);
      this.logger.log(`Emitted NOTIFICATION event to user ${userId}`);
    } else {
      // Broadcast to all connected clients
      this.server.emit('NOTIFICATION', notification);
      this.logger.log('Emitted NOTIFICATION event to all users');
    }
  }
}
