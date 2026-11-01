import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { SocketGateway } from '@/modules/Socket/Socket.gateway';
import { events } from '@/common/events/events';

@Injectable()
export class WorkspaceDeletedSubscriber {
  constructor(private readonly socketGateway: SocketGateway) {}

  @OnEvent(events.workspace.deleted)
  handleWorkspaceDeleted() {
    this.socketGateway.emitWorkspacesChanged();
  }
}
