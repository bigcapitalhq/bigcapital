import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ClsService } from 'nestjs-cls';
import * as moment from 'moment';
import { TenantModel } from '@/modules/System/models/TenantModel';
import { SaleInvoice } from '@/modules/SaleInvoices/models/SaleInvoice';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { CreateNotificationService } from '../commands/CreateNotification.service';
import { SocketGateway } from '@/modules/Socket/Socket.gateway';

/**
 * Once per day: notify invoice authors when a delivered, still-due invoice’s due date
 * was yesterday (first calendar day overdue).
 */
@Injectable()
export class OverdueSaleInvoiceNotificationsJob {
  private readonly logger = new Logger(OverdueSaleInvoiceNotificationsJob.name);

  constructor(
    private readonly clsService: ClsService,
    @Inject(TenantModel.name)
    private readonly tenantModel: typeof TenantModel,
    @Inject(SaleInvoice.name)
    private readonly saleInvoiceModel: TenantModelProxy<typeof SaleInvoice>,
    private readonly createNotificationService: CreateNotificationService,
    private readonly socketGateway: SocketGateway,
  ) {}

  @Cron('0 8 * * *')
  async notifyNewlyOverdueInvoices() {
    const yesterday = moment().subtract(1, 'day').format('YYYY-MM-DD');

    const tenants = await this.tenantModel
      .query()
      .whereNotNull('seededAt')
      .select('organizationId');

    for (const tenant of tenants) {
      await this.clsService.run(async () => {
        this.clsService.set('organizationId', tenant.organizationId);

        try {
          const invoices = await this.saleInvoiceModel()
            .query()
            .modify('delivered')
            .modify('dueInvoices')
            .where('dueDate', yesterday);

          for (const invoice of invoices) {
            const userId = invoice.userId;
            if (!userId) {
              continue;
            }

            const notification = await this.createNotificationService.createNotification({
              userId,
              title: 'Invoice overdue',
              message: `Invoice ${invoice.invoiceNo} is now overdue.`,
              type: 'warning',
              category: 'billing',
              metadata: {
                saleInvoiceId: invoice.id,
                invoiceNo: invoice.invoiceNo,
                dueDate: invoice.dueDate,
                event: 'saleInvoice.becameOverdue',
              },
            });

            this.socketGateway.emitNotification(userId, notification);
          }
        } catch (error) {
          this.logger.error(
            `Overdue invoice notifications failed for tenant ${tenant.organizationId}`,
            error instanceof Error ? error.stack : String(error),
          );
        }
      });
    }
  }
}
