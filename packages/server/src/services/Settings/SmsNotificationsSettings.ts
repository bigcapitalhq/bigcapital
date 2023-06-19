import { Service, Inject } from 'typedi';
import { isUndefined, omit, keyBy } from 'lodash';
import {
  ISmsNotificationDefined,
  ISmsNotificationMeta,
  IEditSmsNotificationDTO,
  ISmsNotificationAllowedVariable,
} from '@/interfaces';
import TenancyService from '@/services/Tenancy/TenancyService';
import SMSNotificationsConfig from 'config/smsNotifications';
import { ServiceError } from '@/exceptions';
import I18nService from '@/services/I18n/I18nService';

const ERRORS = {
  SMS_NOTIFICATION_KEY_NOT_FOUND: 'SMS_NOTIFICATION_KEY_NOT_FOUND',
  UNSUPPORTED_SMS_MESSAGE_VARIABLES: 'UNSUPPORTED_SMS_MESSAGE_VARIABLES',
};

@Service()
export default class SmsNotificationsSettingsService {
  @Inject()
  tenancy: TenancyService;

  @Inject('logger')
  logger: any;

  @Inject()
  i18nService: I18nService;

  /**
   * Retrieve sms notification meta from the given notification key.
   * @param {string} notificationKey - Notification key.
   * @returns {ISmsNotificationMeta}
   */
  public getSmsNotificationMeta = (
    tenantId: number,
    notificationKey: string
  ): ISmsNotificationMeta => {
    const notificationsByKey = keyBy(SMSNotificationsConfig, 'key');
    const notification = notificationsByKey[notificationKey];

    // Validates sms notification exists.
    this.validateSmsNotificationExists(notification);

    return this.transformSmsNotifConfigToMeta(tenantId, notification);
  };

  /**
   * Transformes the sms notification config to notificatin meta.
   * @param {Settings} settings
   * @param {ISmsNotificationDefined} smsNotification
   * @returns {ISmsNotificationMeta}
   */
  private transformSmsNotifConfigToMeta = (
    tenantId: number,
    smsNotification: ISmsNotificationDefined
  ): ISmsNotificationMeta => {
    const settings = this.tenancy.settings(tenantId);
    const i18n = this.tenancy.i18n(tenantId);
    const group = 'sms-notification';

    const defaultSmsMessage = i18n.__(smsNotification.defaultSmsMessage);

    return {
      ...omit(smsNotification, [
        'defaultSmsMessage',
        'defaultIsNotificationEnabled',
      ]),
      notificationLabel: i18n.__(smsNotification.notificationLabel),
      notificationDescription: i18n.__(smsNotification.notificationDescription),
      moduleFormatted: i18n.__(smsNotification.moduleFormatted),
      allowedVariables: smsNotification.allowedVariables.map(
        (notification) => ({
          ...notification,
          description: i18n.__(notification.description),
        })
      ),
      defaultSmsMessage,
      smsMessage: settings.get(
        {
          key: `sms-message.${smsNotification.key}`,
          group,
        },
        defaultSmsMessage
      ),
      isNotificationEnabled: settings.get(
        {
          key: `sms-notification-enable.${smsNotification.key}`,
          group,
        },
        smsNotification.defaultIsNotificationEnabled
      ),
    };
  };

  /**
   * Retrieve the sms notifications list.
   * @param {number} tenantId
   */
  public smsNotificationsList = (
    tenantId: number
  ): Promise<ISmsNotificationMeta[]> => {
    return SMSNotificationsConfig.map((notification) => {
      return this.transformSmsNotifConfigToMeta(tenantId, notification);
    });
  };

  /**
   * Edits/Mutates the sms notification message text.
   * @param {number} tenantId - Tenant id.
   * @param {IEditSmsNotificationDTO} editSmsNotificationDTO - Edit SMS notification DTO.
   */
  public editSmsNotificationMessage = (
    tenantId: number,
    editDTO: IEditSmsNotificationDTO
  ): ISmsNotificationMeta => {
    const settings = this.tenancy.settings(tenantId);

    const notification = this.getSmsNotificationMeta(
      tenantId,
      editDTO.notificationKey
    );
    const group = 'sms-notification';

    if (editDTO.messageText) {
      this.validateSmsMessageVariables(
        editDTO.messageText,
        notification.allowedVariables
      );
      settings.set({
        key: `sms-message.${editDTO.notificationKey}`,
        value: editDTO.messageText,
        group,
      });
    }
    if (!isUndefined(editDTO.isNotificationEnabled)) {
      settings.set({
        key: `sms-notification-enable.${editDTO.notificationKey}`,
        value: editDTO.isNotificationEnabled,
        group,
      });
    }
    return notification;
  };

  /**
   * Vaidates the sms notification key existence.
   * @param {string} notificationKey
   */
  private validateSmsNotificationExists = (
    notificationDefined: ISmsNotificationDefined | null
  ): void => {
    if (!notificationDefined) {
      throw new ServiceError(ERRORS.SMS_NOTIFICATION_KEY_NOT_FOUND);
    }
  };

  /**
   * Retrieve unspported message arguments.
   * @param {string} smsMessage - SMS message.
   * @param {string[]} args -
   * @returns {string[]}
   */
  private getUnsupportedMessageArgs = (
    smsMessage: string,
    args: string[]
  ): string[] => {
    const matchedVariables = smsMessage.match(/\{(.*?)\}/g).map((matched) => {
      return matched.replace('{', '').replace('}', '');
    });
    const invalidVariables = matchedVariables.filter(
      (variable) => args.indexOf(variable) === -1
    );
    return invalidVariables;
  };

  /**
   * Validates the sms message variables.
   * @param {string} smsMessage
   * @param {string[]} args
   */
  private validateSmsMessageVariables(
    smsMessage: string,
    allowedVariables: ISmsNotificationAllowedVariable[]
  ) {
    const allowedVariablesKeys = allowedVariables.map(
      (allowed) => allowed.variable
    );
    const unsupportedArgs = this.getUnsupportedMessageArgs(
      smsMessage,
      allowedVariablesKeys
    );

    if (unsupportedArgs.length > 0) {
      throw new ServiceError(ERRORS.UNSUPPORTED_SMS_MESSAGE_VARIABLES, null, {
        unsupportedArgs,
      });
    }
  }
}
