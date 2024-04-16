import { IAuthSignedUpEventPayload } from '@/interfaces';
import events from '@/subscribers/events';
import config from '@/config';
import { Subscription } from '../Subscription';
import { Inject, Service } from 'typedi';

@Service()
export class SubscribeFreeOnSignupCommunity {
  @Inject()
  private subscriptionService: Subscription;

  /**
   * Attaches events with handlers.
   */
  public attach = (bus) => {
    bus.subscribe(
      events.auth.signUp,
      this.subscribeFreeOnSigupCommunity.bind(this)
    );
  };

  /**
   * Creates a new free subscription once the user signup if the app is self-hosted.
   * @param {IAuthSignedUpEventPayload} 
   * @returns {Promise<void>} 
   */
  private async subscribeFreeOnSigupCommunity({
    signupDTO,
    tenant,
    user,
  }: IAuthSignedUpEventPayload) {
    if (config.hostedOnBigcapitalCloud) return null;

    await this.subscriptionService.newSubscribtion(tenant.id, 'free');
  }
}
