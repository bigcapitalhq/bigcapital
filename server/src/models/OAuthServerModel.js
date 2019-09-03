import OAuthClient from '@/models/OAuthClient';
import OAuthToken from '@/models/OAuthToken';
import User from '@/models/User';

export default {
  /**
   * Retrieve the access token.
   * @param {String} bearerToken -
   */
  async getAccessToken(bearerToken) {
    const token = await OAuthClient.where({
      access_token: bearerToken,
    }).fetch();

    return {
      accessToken: token.attributes.access_token,
      client: {
        id: token.attributes.client_id,
      },
      expires: token.attributes.access_token_expires_on,
    };
  },

  /**
   * Retrieve the client from client id and secret.
   * @param {Number} clientId -
   * @param {String} clientSecret -
   */
  async getClient(clientId, clientSecret) {
    const token = await OAuthClient.where({
      client_id: clientId,
      client_secret: clientSecret,
    });

    if (!token) { return {}; }

    return {
      clientId: token.attributes.client_id,
      clientSecret: token.attributes.client_secret,
      grants: ['password'],
    };
  },

  /**
   * Get specific user with given username and password.
   */
  async getUser(username, password) {
    const user = await User.query((query) => {
      query.where('username', username);
      query.where('password', password);
    }).fetch();

    return {
      ...user.attributes,
    };
  },

  /**
   * Saves the access token.
   * @param {Object} token -
   * @param {Object} client -
   * @param {Object} user -
   */
  async saveAccessToken(token, client, user) {
    const oauthToken = OAuthToken.forge({
      access_token: token.accessToken,
      access_token_expires_on: token.accessTokenExpiresOn,
      client_id: client.id,
      refresh_token: token.refreshToken,
      refresh_token_expires_on: token.refreshTokenExpiresOn,
      user_id: user.id,
    });

    await oauthToken.save();

    return {
      client: { id: client.id },
      user: { id: user.id },
    };
  },
};
