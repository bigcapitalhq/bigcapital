import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GetStripeAuthorizationLinkService {
  constructor(private readonly config: ConfigService) {}

  public getStripeAuthLink() {
    const clientId = this.config.get('stripePayment.clientId');
    const redirectUrl = this.config.get('stripePayment.redirectUrl');

    const authorizationUri = `https://connect.stripe.com/oauth/v2/authorize?response_type=code&client_id=${clientId}&scope=read_write&redirect_uri=${redirectUrl}`;

    return authorizationUri;
  }
}
