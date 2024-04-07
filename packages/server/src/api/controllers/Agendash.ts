import config from '@/config';
import agendash from 'agendash';
import { Router } from 'express';
import basicAuth from 'express-basic-auth';
import { Container } from 'typedi';

export default class AgendashController {
  static router() {
    const router = Router();
    const agendaInstance = Container.get('agenda');

    router.use(
      '/dash',
      basicAuth({
        users: {
          [config.agendash.user]: config.agendash.password,
        },
        challenge: true,
      }),
      agendash(agendaInstance),
    );
    return router;
  }
}
