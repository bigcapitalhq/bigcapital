import { ItemReorderPointNotificationService } from './ItemReorderPointNotification.service';

interface IMockItem {
  id: number;
  type: string;
  active: boolean;
  name: string;
  code?: string;
  quantityOnHand: number | null;
  reorderPoint: number | null;
  reorderPointNotified: boolean;
}

interface IMockServiceOptions {
  item: IMockItem;
  notificationsEnabled?: boolean;
  notificationEmail?: string;
  claimAffectedRows?: number;
  mailError?: Error;
}

function createService({
  item,
  notificationsEnabled = true,
  notificationEmail = 'owner@example.com',
  claimAffectedRows = 1,
  mailError,
}: IMockServiceOptions) {
  const queryBuilder = {
    findByIds: jest.fn().mockResolvedValue([item]),
    findById: jest.fn().mockResolvedValue(item),
    where: jest.fn().mockReturnThis(),
    patch: jest.fn((values: { reorderPointNotified: boolean }) =>
      Promise.resolve(values.reorderPointNotified ? claimAffectedRows : 1),
    ),
  };
  const itemModel = jest.fn(() => ({
    query: () => queryBuilder,
  }));
  const settingsStore = {
    get: jest.fn((query: { key: string }, defaultValue: unknown) => {
      if (query.key === 'reorder_point_notifications') {
        return notificationsEnabled;
      }
      if (query.key === 'reorder_point_notification_email') {
        return notificationEmail;
      }
      return defaultValue;
    }),
  };
  const tenancyContext = {
    getTenant: jest.fn().mockResolvedValue({ metadata: { name: 'Acme' } }),
  };
  const mailTransporter = {
    send: mailError
      ? jest.fn().mockRejectedValue(mailError)
      : jest.fn().mockResolvedValue(undefined),
  };
  const configService = {
    get: jest.fn().mockReturnValue('http://localhost:4000'),
  };
  const service = new ItemReorderPointNotificationService(
    itemModel as any,
    (() => Promise.resolve(settingsStore)) as any,
    tenancyContext as any,
    mailTransporter as any,
    configService as any,
  );

  return { service, queryBuilder, mailTransporter };
}

const makeItem = (overrides: Partial<IMockItem> = {}): IMockItem => ({
  id: 1,
  type: 'inventory',
  active: true,
  name: 'Widget',
  code: 'W-001',
  quantityOnHand: 5,
  reorderPoint: 10,
  reorderPointNotified: false,
  ...overrides,
});

describe('ItemReorderPointNotificationService', () => {
  it('sends a notification once the quantity is at the reorder point', async () => {
    const { service, mailTransporter } = createService({ item: makeItem() });

    await service.processItems([1]);

    expect(mailTransporter.send).toHaveBeenCalledTimes(1);
  });

  it('does not send a notification when the item is already notified', async () => {
    const { service, mailTransporter } = createService({
      item: makeItem({ quantityOnHand: 5, reorderPoint: 10 }),
      claimAffectedRows: 0,
    });

    await service.processItems([1]);

    expect(mailTransporter.send).not.toHaveBeenCalled();
  });

  it('resets the notification state when the item is restocked above the reorder point', async () => {
    const { service, mailTransporter, queryBuilder } = createService({
      item: makeItem({ quantityOnHand: 15, reorderPoint: 10 }),
    });

    await service.processItems([1]);

    expect(queryBuilder.patch).toHaveBeenCalledWith({
      reorderPointNotified: false,
    });
    expect(mailTransporter.send).not.toHaveBeenCalled();
  });

  it('skips sending when the notification setting is disabled', async () => {
    const { service, mailTransporter } = createService({
      item: makeItem(),
      notificationsEnabled: false,
    });

    await service.processItems([1]);

    expect(mailTransporter.send).not.toHaveBeenCalled();
  });

  it('resets the notification state when sending the email fails', async () => {
    const mailError = new Error('SMTP error');
    const { service, queryBuilder } = createService({
      item: makeItem(),
      mailError,
    });

    await expect(service.processItems([1])).rejects.toThrow('SMTP error');
    expect(queryBuilder.patch).toHaveBeenCalledWith({
      reorderPointNotified: false,
    });
  });
});
