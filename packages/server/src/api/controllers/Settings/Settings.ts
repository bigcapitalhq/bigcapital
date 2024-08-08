import { Inject, Service } from 'typedi';
import { Router, Request, Response } from 'express';
import { body, query } from 'express-validator';
import { pick } from 'lodash';
import { IOptionDTO, IOptionsDTO } from '@/interfaces';
import BaseController from '@/api/controllers/BaseController';
import asyncMiddleware from '@/api/middleware/asyncMiddleware';
import { AbilitySubject, PreferencesAction } from '@/interfaces';
import SettingsService from '@/services/Settings/SettingsService';
import CheckPolicies from '@/api/middleware/CheckPolicies';

@Service()
export default class SettingsController extends BaseController {
  @Inject()
  settingsService: SettingsService;

  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    router.post(
      '/',
      CheckPolicies(PreferencesAction.Mutate, AbilitySubject.Preferences),
      this.saveSettingsValidationSchema,
      this.validationResult,
      asyncMiddleware(this.saveSettings.bind(this))
    );
    router.get(
      '/',
      this.getSettingsSchema,
      this.validationResult,
      asyncMiddleware(this.getSettings.bind(this))
    );
    return router;
  }

  /**
   * Save settings validation schema.
   */
  private get saveSettingsValidationSchema() {
    return [
      body('options').isArray({ min: 1 }),
      body('options.*.key').exists().trim().isLength({ min: 1 }),
      body('options.*.value').exists().trim(),
      body('options.*.group').exists().trim().isLength({ min: 1 }),
    ];
  }

  /**
   * Retrieve the application options from the storage.
   */
  private get getSettingsSchema() {
    return [query('key').optional().trim(), query('group').optional().trim()];
  }

  /**
   * Saves the given options to the storage.
   * @param {Request} req -
   * @param {Response} res -
   */
  public async saveSettings(req: Request, res: Response, next) {
    const { tenantId } = req;
    const optionsDTO: IOptionsDTO = this.matchedBodyData(req);
    const { settings } = req;

    const errorReasons: { type: string; code: number; keys: [] }[] = [];
    const notDefinedOptions = this.settingsService.validateNotDefinedSettings(
      tenantId,
      optionsDTO.options
    );

    if (notDefinedOptions.length) {
      errorReasons.push({
        type: 'OPTIONS.KEY.NOT.DEFINED',
        code: 200,
        keys: notDefinedOptions.map((o) => ({ ...pick(o, ['key', 'group']) })),
      });
    }
    if (errorReasons.length) {
      return res.status(400).send({ errors: errorReasons });
    }
    optionsDTO.options.forEach((option: IOptionDTO) => {
      settings.set({ ...option });
    });
    try {
      await settings.save();

      return res.status(200).send({
        type: 'success',
        code: 'OPTIONS.SAVED.SUCCESSFULLY',
        message: 'Options have been saved successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieve settings.
   * @param {Request} req
   * @param {Response} res
   */
  public getSettings(req: Request, res: Response) {
    const { settings } = req;
    const allSettings = settings.all();

    return res.status(200).send({ settings: allSettings });
  }
}
