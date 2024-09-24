import { Service } from 'typedi';
import config from '@/config';

@Service()
export class GetStripeAuthorizationLinkService {
  public getStripeAuthLink() {
    const clientId = config.stripePayment.clientId;
    const redirectUrl = config.stripePayment.redirectTo;

    const authorizationUri = `https://connect.stripe.com/oauth/v2/authorize?response_type=code&client_id=${clientId}&scope=read_write&redirect_uri=${redirectUrl}`;

    return authorizationUri;
  }
}
