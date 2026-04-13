import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';
import { CreateNotificationService } from '../commands/CreateNotification.service';
import { SocketGateway } from '@/modules/Socket/Socket.gateway';
import { IComputeItemCostJobCompletedPayload } from '@/modules/InventoryCost/types/InventoryCost.types';

@Injectable()
export class InventoryCostNotificationsSubscriber {
  constructor(
    private readonly createNotificationService: CreateNotificationService,
    private readonly socketGateway: SocketGateway,
  ) {}

  /**
   * Handles the item cost calculation completion event.
   * Creates a notification and emits it via Socket.IO.
   * @param {IComputeItemCostJobCompletedPayload} payload - Event payload
   */
  @OnEvent(events.inventory.onComputeItemCostJobCompleted)
  async handleCostCalculationCompleted(
    payload: IComputeItemCostJobCompletedPayload & { userId?: number; organizationId?: number },
  ) {
    const { itemId, userId, startingDate } = payload;

    try {
      // Create notification in database
      const notification = await this.createNotificationService.createNotification({
        userId: userId ?? null,
        title: 'Cost Calculation Complete',
        message: `Item cost calculation has been completed successfully for item #${itemId}.`,
        type: 'success',
        category: 'inventory',
        metadata: {
          itemId,
          startingDate,
          event: 'inventory.costCalculationCompleted',
        },
      });

      // Emit real-time notification via Socket.IO
      this.socketGateway.emitNotification(userId ?? null, notification);
    } catch (error) {
      console.error('[InventoryCostNotificationsSubscriber] Failed to create notification:', error);
      // Don't throw - we don't want to break the cost calculation flow
    }
  }
}
