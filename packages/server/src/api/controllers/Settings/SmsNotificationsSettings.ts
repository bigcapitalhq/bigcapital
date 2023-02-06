import { Inject, Service } from 'typedi';
import { check, oneOf, param } from 'express-validator';
import { Router, Response, Request, NextFunction } from 'express';

import SmsNotificationsSettingsService from '@/services/Settings/SmsNotificationsSettings';
import BaseController from '../BaseController';

import { ServiceError } from '@/exceptions';
import {
  AbilitySubject,
  PreferencesAction,
  IEditSmsNotificationDTO,
} from '@/interfaces';
import CheckPolicies from '@/api/middleware/CheckPolicies';

@Service()
export default class SettingsController extends BaseController {
  @Inject()
  smsNotificationsSettings: SmsNotificationsSettingsService;

  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    router.get(
      '/sms-notifications',
      [],
      this.validationResult,
      this.asyncMiddleware(this.smsNotifications),
      this.handleServiceErrors
    );
    router.get(
      '/sms-notification/:notification_key',
      [param('notification_key').exists().isString()],
      this.validationResult,
      this.asyncMiddleware(this.smsNotification),
      this.handleServiceErrors
    );
    router.post(
      '/sms-notification',
      CheckPolicies(PreferencesAction.Mutate, AbilitySubject.Preferences),
      [
        check('notification_key').exists(),
        oneOf([
          check('message_text').exists(),
          check('is_notification_enabled').exists().isBoolean().toBoolean(),
        ]),
      ],
      this.validationResult,
      this.asyncMiddleware(this.updateSmsNotification),
      this.handleServiceErrors
    );
    return router;
  }

  /**
   * Retrieve the sms notifications.
   * @param {Request} req -
   * @param {Response} res -
   * @param {NextFunction} next -
   */
  private smsNotifications = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { tenantId } = req;

    try {
      const notifications =
        await this.smsNotificationsSettings.smsNotificationsList(tenantId);

      return res.status(200).send({ notifications });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Retrieve the sms notification details from the given notification key.
   * @param {Request} req -
   * @param {Response} res -
   * @param {NextFunction} next -
   */
  private smsNotification = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { tenantId } = req;
    const { notification_key: notificationKey } = req.params;

    try {
      const notification =
        await this.smsNotificationsSettings.getSmsNotificationMeta(
          tenantId,
          notificationKey
        );

      return res.status(200).send({ notification });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update the given sms notification key.
   * @param {Request} req -
   * @param {Response} res -
   * @param {NextFunction} next -
   */
  private updateSmsNotification = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { tenantId } = req;
    const editDTO: IEditSmsNotificationDTO = this.matchedBodyData(req);

    try {
      await this.smsNotificationsSettings.editSmsNotificationMessage(
        tenantId,
        editDTO
      );
      return res.status(200).send({
        message: 'Sms notification settings has been updated successfully.',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Handles service errors.
   * @param {Error} error
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  private handleServiceErrors = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (error instanceof ServiceError) {
      if (error.errorType === 'SMS_NOTIFICATION_KEY_NOT_FOUND') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'SMS_NOTIFICATION_KEY_NOT_FOUND', code: 1000 }],
        });
      }
      if (error.errorType === 'UNSUPPORTED_SMS_MESSAGE_VARIABLES') {
        return res.boom.badRequest(null, {
          errors: [
            {
              type: 'UNSUPPORTED_SMS_MESSAGE_VARIABLES',
              code: 1100,
              data: { ...error.payload },
            },
          ],
        });
      }
    }
    next(error);
  };
}
