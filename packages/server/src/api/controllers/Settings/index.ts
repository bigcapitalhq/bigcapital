import { Router } from 'express';
import { Container, Service } from 'typedi';
import SmsNotificationSettings from './SmsNotificationsSettings';
import Settings from './Settings';
import EasySmsIntegrationController from './EasySmsIntegration';
import { AbilitySubject, PreferencesAction } from '@/interfaces';
import CheckPolicies from '@/api/middleware/CheckPolicies';

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
