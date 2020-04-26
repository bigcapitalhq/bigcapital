import express from 'express';
import asyncMiddleware from '@/http/middleware/asyncMiddleware';

export default {
  /**
   * Router constructor.
   */
  router() {
    const router = express.Router();

    router.get('/',
      this.getAccountTypesList.validation,
      asyncMiddleware(this.getAccountTypesList.handler));

    return router;
  },

  /**
   * Retrieve accounts types list.
   */
  getAccountTypesList: {
    validation: [],
    async handler(req, res) {
      const { AccountType } = req.models;
      const accountTypes = await AccountType.query();

      return res.status(200).send({
        account_types: accountTypes,
      });
    },
  },
};
