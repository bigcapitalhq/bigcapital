import express from 'express';
import OAuthServer from 'express-oauth-server';
import OAuthServerModel from '@/models/OAuthServerModel';

export default {

  /**
   * Router constructor method.
   */
  router() {
    const router = express.Router();

    router.oauth = new OAuthServer({
      model: OAuthServerModel,
    });

    router.post('/token', router.oauth.token());
    // router.get('authorize', this.getAuthorize);
    // router.post('authorize', this.postAuthorize);

    return router;
  },
};
