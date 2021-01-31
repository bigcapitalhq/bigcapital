import { Service } from 'typedi';
import { Router, Request, Response } from 'express';
import { body, query } from 'express-validator';
import { pick } from 'lodash';
import { IOptionDTO, IOptionsDTO } from 'interfaces';
import BaseController from 'api/controllers/BaseController';
import asyncMiddleware from 'api/middleware/asyncMiddleware';
import {
  getDefinedOptions,
  isDefinedOptionConfigurable,
} from 'utils';

@Service()
export default  class SettingsController extends BaseController{
  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    router.post('/',
      this.saveSettingsValidationSchema,
      this.validationResult,
      asyncMiddleware(this.saveSettings.bind(this)),
    );
    router.get('/',
      this.getSettingsSchema,
      this.validationResult,
      asyncMiddleware(this.getSettings.bind(this)),
    );
    return router;
  }

  /**
   * Save settings validation schema.
   */
  get saveSettingsValidationSchema() {
    return [
      body('options').isArray({ min: 1 }),
      body('options.*.key').exists().trim().escape().isLength({ min: 1 }),
      body('options.*.value').exists().trim().escape().isLength({ min: 1 }),
      body('options.*.group').exists().trim().escape().isLength({ min: 1 }),
    ];
  }

  /**
   * Retrieve the application options from the storage.
   */
  get getSettingsSchema() {
    return [
      query('key').optional().trim().escape(),
      query('group').optional().trim().escape(),
    ];
  }

  /**
   * Observes application configuration option, whether all options configured
   * sets `app_configured` option.
   * @param {Setting} settings 
   */
  observeAppConfigsComplete(settings) {
    if (!settings.get('app_configured', false)) {
      const definedOptions = getDefinedOptions();

      const isNotConfigured = definedOptions.some((option) => {
        const isDefined = isDefinedOptionConfigurable(option.key, option.group);
        const hasStoredOption = settings.get({ key: option.key, group: option.group });

        return (isDefined && !hasStoredOption);
      });
      if (!isNotConfigured) {
        settings.set('app_configured', true);
      }
    }
  }

  /**
   * Saves the given options to the storage.
   * @param {Request} req - 
   * @param {Response} res - 
   */
  async saveSettings(req: Request, res: Response) {
    const { Option } = req.models;
    const optionsDTO: IOptionsDTO = this.matchedBodyData(req);
    const { settings } = req;

    const errorReasons: { type: string, code: number, keys: [] }[] = [];
    const notDefinedOptions = Option.validateDefined(optionsDTO.options);

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
    this.observeAppConfigsComplete(settings);

    await settings.save();

    return res.status(200).send({ 
      type: 'success',
      code: 'OPTIONS.SAVED.SUCCESSFULLY',
      message: 'Options have been saved successfully.',
    });
  }

  /**
   * Retrieve settings.
   * @param {Request} req 
   * @param {Response} res 
   */
  getSettings(req: Request, res: Response) {
    const { settings } = req;
    const allSettings = settings.all();

    return res.status(200).send({ settings: allSettings });
  }
};
