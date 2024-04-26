import { IAuthSignedUpEventPayload } from '@/interfaces';
import events from '@/subscribers/events';
import { Inject } from 'typedi';

export class SendVerfiyMailOnSignUp {
  @Inject('agenda')
  private agenda: any;

  /**
   * Attaches events with handles.
   */
  public attach(bus) {
    bus.subscribe(events.auth.signUp, this.handleSendVerifyMailOnSignup);
  }

  /**
   *
   * @param {ITaxRateEditedPayload} payload -
   */
  private handleSendVerifyMailOnSignup = async ({
    user,
  }: IAuthSignedUpEventPayload) => {
    const payload = {
      email: user.email,
      token: user.verifyToken,
      fullName: user.firstName,
    };
    await this.agenda.now('send-signup-verify-mail', payload);
  };
}
