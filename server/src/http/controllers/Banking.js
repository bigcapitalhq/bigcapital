
import express from 'express';

export default {


  router() {
    const router = express.Router();

    return router;
  },

  reconciliations: {
    validation: [

    ],
    async handler(req, res) {

    },
  },

  reconciliation: {
    validation: [
      body('from_date'),
      body('to_date'),
      body('closing_balance'),

    ],
    async handler(req, res) {

    },
  },
}