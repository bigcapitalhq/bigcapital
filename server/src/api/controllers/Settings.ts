import { Router, Request, Response } from 'express';
import { body, query, validationResult } from 'express-validator';
import { pick } from 'lodash';
import { IOptionDTO, IOptionsDTO } from 'interfaces';
import BaseController from 'api/controllers/BaseController';
import asyncMiddleware from 'api/middleware/asyncMiddleware';

export default  class SettingsController extends BaseController{
  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    router.post('/',
      this.saveSettingsValidationSchema,
      asyncMiddleware(this.saveSettings.bind(this)));

    router.get('/',
      this.getSettingsSchema,
      asyncMiddleware(this.getSettings.bind(this)));

    return router;
  }

  /**
   * Save settings validation schema.
   */
  get saveSettingsValidationSchema() {
    return [
      body('options').isArray({ min: 1 }),
      body('options.*.key').exists(),
      body('options.*.value').exists(),
      body('options.*.group').exists(),
    ];
  }

  /**
   * Retrieve the application options from the storage.
   */
  get getSettingsSchema() {
    return [
      query('key').optional(),
      query('group').optional(),
    ];
  }

  /**
   * Saves the given options to the storage.
   * @param {Request} req - 
   * @param {Response} res - 
   */
  saveSettings(req: Request, res: Response) {
    const { Option } = req.models;
    const optionsDTO: IOptionsDTO = this.matchedBodyData(req);
    const { settings } = req;

    const errorReasons: { type: string, code: number, keys: [] }[] = [];
    const notDefinedOptions = Option.validateDefined(optionsDTO.options);

    if (notDefinedOptions.length) {
      errorReasons.push({
        type: 'OPTIONS.KEY.NOT.DEFINED',
        code: 200,
        keys: notDefinedOptions.map((o) => ({
          ...pick(o, ['key', 'group'])
        })),
      });
    }
    if (errorReasons.length) {
      return res.status(400).send({ errors: errorReasons });
    }
    optionsDTO.options.forEach((option: IOptionDTO) => {
      settings.set({ ...option });
    });
 
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
