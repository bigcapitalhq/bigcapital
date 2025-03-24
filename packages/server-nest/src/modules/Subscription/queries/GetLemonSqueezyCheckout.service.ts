import { createCheckout } from '@lemonsqueezy/lemonsqueezy.js';
import { configureLemonSqueezy } from '../utils';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SystemUser } from '@/modules/System/models/SystemUser';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';

@Injectable()
export class GetLemonSqueezyCheckoutService {
  constructor(private readonly configService: ConfigService,

    private readonly tenancyContext: TenancyContext
  ) {}

  /**
   * Retrieves the LemonSqueezy checkout url.
   * @param {number} variantId
   * @param {SystemUser} user
   */
  async getCheckout(variantId: number) {
    configureLemonSqueezy();
    const user = await this.tenancyContext.getSystemUser();

    return createCheckout(
      this.configService.get('lemonSqueezy.storeId'),
      variantId,
      {
        checkoutOptions: {
          embed: true,
          media: true,
          logo: true,
        },
        checkoutData: {
          email: user.email,
          custom: {
            user_id: user.id + '',
            tenant_id: user.tenantId + '',
          },
        },
        productOptions: {
          enabledVariants: [variantId],
          redirectUrl: this.configService.get('lemonSqueezy.redirectTo'),
          receiptButtonText: 'Go to Dashboard',
          receiptThankYouNote: 'Thank you for signing up to Lemon Stand!',
        },
      },
    );
  }
}
