import { Service } from 'typedi';
import events from '@/subscribers/events';
import { ABILITIES_CACHE } from '../../api/middleware/AuthorizationMiddleware';

@Service()
export default class PurgeAuthorizedUserOnceRoleMutate {
  /**
   * Attaches events with handlers.
   * @param bus 
   */
  attach(bus) {
    bus.subscribe(events.roles.onEdited, this.purgeAuthedUserOnceRoleMutated);
    bus.subscribe(events.roles.onDeleted, this.purgeAuthedUserOnceRoleMutated);
  }

  /**
   * Purges authorized user once role edited or deleted.
   */
  purgeAuthedUserOnceRoleMutated({}) {
    ABILITIES_CACHE.reset();
  }
}
