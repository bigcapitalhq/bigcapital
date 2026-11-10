import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';
import { IAccountEventDeletedPayload } from '@/interfaces/Account';
import { DisconnectSimpleFinItemService } from '../commands/DisconnectSimpleFinItem.service';

@Injectable()
export class DisconnectSimpleFinItemOnAccountDeleted {
  constructor(
    private readonly disconnectSimpleFinItem: DisconnectSimpleFinItemService,
  ) {}

  /**
   * Removes the SimpleFIN item once its last linked account gets deleted.
   * @param {IAccountEventDeletedPayload} payload
   */
  @OnEvent(events.accounts.onDeleted)
  public async handleRemoveSimpleFinItemOnAccountDeleted({
    oldAccount,
    trx,
  }: IAccountEventDeletedPayload) {
    const simplefinItemId = (oldAccount as { simplefinItemId?: string | null })
      .simplefinItemId;

    // Can't continue if the deleted account is not linked to a SimpleFIN item.
    if (!simplefinItemId) return;

    await this.disconnectSimpleFinItem.removeItemIfUnused(simplefinItemId, trx);
  }
}
