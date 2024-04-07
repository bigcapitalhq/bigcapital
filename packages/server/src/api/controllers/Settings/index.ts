import { Router } from 'express';
import { Container, Service } from 'typedi';
import EasySmsIntegrationController from './EasySmsIntegration';
import Settings from './Settings';
import SmsNotificationSettings from './SmsNotificationsSettings';

@Service()
export default class SettingsController {
  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    router.use('/', Container.get(EasySmsIntegrationController).router());
    router.use('/', Container.get(SmsNotificationSettings).router());
    router.use('/', Container.get(Settings).router());

    return router;
  }
}
