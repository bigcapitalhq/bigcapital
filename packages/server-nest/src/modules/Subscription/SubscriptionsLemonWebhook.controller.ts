import { Controller, Post, Req, Res } from '@nestjs/common';
import { LemonSqueezyWebhooks } from './webhooks/LemonSqueezyWebhooks';

@Controller('/webhooks/lemon')
export class SubscriptionsLemonWebhook {
  constructor(private readonly lemonWebhooksService: LemonSqueezyWebhooks) {}

  /**
   * Listens to Lemon Squeezy webhooks events.
   * @param {Request} req
   * @param {Response} res
   * @returns {Response}
   */
  @Post('/')
  async lemonWebhooks(@Req() req: Request) {
    const data = req.body;
    const signature = (req.headers['x-signature'] as string) ?? '';
    const rawBody = req.rawBody;

    await this.lemonWebhooksService.handlePostWebhook(rawBody, data, signature);
  }
}
