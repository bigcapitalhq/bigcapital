import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isEmail } from 'class-validator';
import { chunk } from 'lodash';
import * as path from 'path';
import { Item } from '@/modules/Items/models/Item';
import { Mail } from '@/modules/Mail/Mail';
import { MailTransporter } from '@/modules/Mail/MailTransporter.service';
import { SettingsStore } from '@/modules/Settings/SettingsStore';
import { SETTINGS_PROVIDER } from '@/modules/Settings/Settings.types';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import {
  REORDER_POINT_NOTIFICATION_EMAIL_SETTING,
  REORDER_POINT_NOTIFICATIONS_SETTING,
} from '../ItemReorderPoints.constants';
import { normalizeReorderPointValue } from '../ItemReorderPoints.utils';

const ITEMS_CHUNK_SIZE = 100;

@Injectable()
export class ItemReorderPointNotificationService {
  constructor(
    @Inject(Item.name)
    private readonly itemModel: TenantModelProxy<typeof Item>,

    @Inject(SETTINGS_PROVIDER)
    private readonly settingsStore: () => SettingsStore,

    private readonly tenancyContext: TenancyContext,
    private readonly mailTransporter: MailTransporter,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Processes the given item ids and sends low-stock notifications when needed.
   * @param {number[]} itemIds
   */
  public async processItems(itemIds: number[]): Promise<void> {
    if (!Array.isArray(itemIds)) {
      return;
    }
    const uniqueItemIds = [
      ...new Set(
        itemIds
          .map((itemId) => Number(itemId))
          .filter((itemId) => Number.isFinite(itemId)),
      ),
    ];

    if (!uniqueItemIds.length) {
      return;
    }
    const settings = await this.settingsStore();
    const notificationsEnabled = Boolean(
      settings.get(
        { group: 'items', key: REORDER_POINT_NOTIFICATIONS_SETTING },
        false,
      ),
    );
    const notificationEmail = settings.get(
      { group: 'items', key: REORDER_POINT_NOTIFICATION_EMAIL_SETTING },
      '',
    );
    const canSendEmail =
      notificationsEnabled &&
      typeof notificationEmail === 'string' &&
      isEmail(notificationEmail);

    for (const itemIdsChunk of chunk(uniqueItemIds, ITEMS_CHUNK_SIZE)) {
      const items = await this.itemModel().query().findByIds(itemIdsChunk);

      for (const item of items) {
        await this.processItem(item, canSendEmail, notificationEmail as string);
      }
    }
  }

  /**
   * Processes a single item.
   * @param {Item} item
   * @param {boolean} canSendEmail
   * @param {string} notificationEmail
   */
  private async processItem(
    item: Item,
    canSendEmail: boolean,
    notificationEmail: string,
  ): Promise<void> {
    if (!item) {
      return;
    }
    if (item.type !== 'inventory') {
      await this.resetNotificationState(item.id);
      return;
    }
    const reorderPoint = normalizeReorderPointValue(item.reorderPoint);
    const quantityOnHand = normalizeReorderPointValue(item.quantityOnHand) ?? 0;

    if (reorderPoint === null || quantityOnHand > reorderPoint) {
      await this.resetNotificationState(item.id);
      return;
    }
    if (!item.active || !canSendEmail) {
      return;
    }
    const claimed = await this.claimNotification(item.id, reorderPoint);

    if (!claimed) {
      return;
    }
    try {
      const currentItem = await this.itemModel().query().findById(item.id);

      if (
        !currentItem ||
        !currentItem.active ||
        currentItem.type !== 'inventory'
      ) {
        await this.resetNotificationState(item.id);
        return;
      }
      const currentQuantity =
        normalizeReorderPointValue(currentItem.quantityOnHand) ?? 0;

      if (currentQuantity > reorderPoint) {
        await this.resetNotificationState(item.id);
        return;
      }
      await this.sendNotification(currentItem, notificationEmail);
    } catch (error) {
      await this.resetNotificationState(item.id);
      throw error;
    }
  }

  /**
   * Atomically claims the low-stock notification for the given item.
   * @param {number} itemId
   * @param {number} reorderPoint
   * @returns {Promise<boolean>}
   */
  private async claimNotification(
    itemId: number,
    reorderPoint: number,
  ): Promise<boolean> {
    const affectedRows = await this.itemModel()
      .query()
      .where({ id: itemId, type: 'inventory', active: true })
      .where('quantityOnHand', '<=', reorderPoint)
      .where('reorderPointNotified', false)
      .patch({ reorderPointNotified: true });

    return affectedRows > 0;
  }

  /**
   * Resets the low-stock notification state of the given item.
   * @param {number} itemId
   */
  private async resetNotificationState(itemId: number): Promise<void> {
    await this.itemModel()
      .query()
      .where({ id: itemId })
      .where('reorderPointNotified', true)
      .patch({ reorderPointNotified: false });
  }

  /**
   * Sends the low-stock notification email.
   * @param {Item} item
   * @param {string} recipient
   */
  private async sendNotification(item: Item, recipient: string): Promise<void> {
    const tenant = await this.tenancyContext.getTenant(true);
    const baseUrl = this.configService.get('app.baseUrl') || '';
    const quantityOnHand = normalizeReorderPointValue(item.quantityOnHand) ?? 0;
    const reorderPoint = normalizeReorderPointValue(item.reorderPoint) ?? 0;
    const itemUrl = `${baseUrl}/items/${item.id}/edit`;
    const logoPath = path.join(
      global.__images_dirname || '',
      '/bigcapital.png',
    );

    const mail = new Mail()
      .setSubject(`Low stock alert: ${item.name}`)
      .setView('mail/ItemReorderPoint.html')
      .setTo(recipient)
      .setAttachments([
        {
          filename: 'bigcapital.png',
          path: logoPath,
          cid: 'bigcapital_logo',
        },
      ])
      .setData({
        companyName: tenant?.metadata?.name ?? '',
        itemName: item.name ?? '',
        itemCode: item.code ?? '',
        quantityOnHand: this.formatQuantity(quantityOnHand),
        reorderPoint: this.formatQuantity(reorderPoint),
        itemUrl,
        root: logoPath,
      });

    await this.mailTransporter.send(mail);
  }

  /**
   * Formats a quantity without unnecessary trailing zeros.
   * @param {number} value
   * @returns {string}
   */
  private formatQuantity(value: number): string {
    return String(Number(value.toFixed(3)));
  }
}
