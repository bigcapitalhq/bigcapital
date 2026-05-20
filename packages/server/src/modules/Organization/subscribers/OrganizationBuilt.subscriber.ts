import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { SocketGateway } from '@/modules/Socket/Socket.gateway';
import { events } from '@/common/events/events';

@Injectable()
export class OrganizationBuiltSubscriber {
  constructor(private readonly socketGateway: SocketGateway) {}

  @OnEvent(events.organization.build)
  handleOrganizationBuild() {
    this.socketGateway.emitWorkspacesChanged();
  }

  @OnEvent(events.organization.built)
  handleOrganizationBuilt() {
    this.socketGateway.emitWorkspacesChanged();
  }
}
