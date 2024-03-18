import config from '@/config';
import {
  authorizationUrlParameters,
  tokenGrantBody,
} from '@/config/oidcConfig';
import { ISystemUser, ITenant } from '@/interfaces';
import { oidcClient } from '@/lib/Oidc/OidcClient';
import { generateToken } from '@/services/Authentication/_utils';
import TenantsManagerService from '@/services/Tenancy/TenantsManager';
import { Tenant } from '@/system/models';
import { cloneDeep } from 'lodash';
import moment from 'moment';
import { TokenSet, UnknownObject, UserinfoResponse } from 'openid-client';
import { Inject } from 'typedi';
interface IOidcLoginResponse {
  token: string;
  user: ISystemUser;
  tenant: ITenant;
}

@Inject()
export class OidcService {
  @Inject('repositories')
  private sysRepositories: any;

  @Inject()
  private tenantsManager: TenantsManagerService;

  /**
   * Generates authorization url
   * @return {string}
   */
  public generateAuthorizationUrl(): string {
    const authorizationUrl = oidcClient.authorizationUrl(
      authorizationUrlParameters
    );
    return authorizationUrl;
  }

  /**
   * Authorize and grant access tokens
   * @param {string} code
   * @return {Promise<TokenSet>}
   */
  public async grantAccessTokenByCode(code: string): Promise<TokenSet> {
    const grantParameters = {
      ...tokenGrantBody,
      code,
    };

    const tokenSet = await oidcClient.grant(grantParameters);

    return tokenSet;
  }

  /**
   * Authorize and grant access tokens
   * @param {string} accessToken
   * @return {Promise<UserinfoResponse<UnknownObject, UnknownObject>>}
   */
  public async getUserInfoByAccessToken(
    accessToken: string
  ): Promise<UserinfoResponse<UnknownObject, UnknownObject>> {
    const userInfo = await oidcClient.userinfo(accessToken);

    return userInfo;
  }

  /**
   * Login or create a user
   * @param {string} code
   * @return {Promise<IOidcLoginResponse>}
   */
  public async loginUser(code: string): Promise<IOidcLoginResponse> {
    if (config.oidcLogin.disabled) throw new Error('Oidc login disabled');

    const tokenSet = await this.grantAccessTokenByCode(code);

    const accessToken = tokenSet.access_token;

    const userInfo = await this.getUserInfoByAccessToken(accessToken);

    const { systemUserRepository } = this.sysRepositories;

    let systemUser = await systemUserRepository.findOneByEmail(userInfo.email);

    // if oidc user is not found in system create new user else login user
    if (!systemUser) {
      const newTenant = await this.tenantsManager.createTenant();

      const signupPayload = {
        firstName: userInfo.given_name,
        lastName: userInfo.family_name,
        email: userInfo.email,
        active: true,
        tenantId: newTenant.id,
        inviteAcceptedAt: moment().format('YYYY-MM-DD'),
      };

      systemUser = await systemUserRepository.create({
        ...signupPayload,
      });
    }

    // Update the last login at of the user.
    await systemUserRepository.patchLastLoginAt(systemUser.id);

    const tenant = await Tenant.query()
      .findById(systemUser.tenantId)
      .withGraphFetched('metadata');

    // Keep the user object immutable.
    const user = cloneDeep(systemUser);

    // Remove password property from user object.
    Reflect.deleteProperty(user, 'password');

    const token = generateToken({
      ...systemUser,
      oidc_access_token: tokenSet.access_token,
      oidc_id_token: tokenSet.id_token,
      oidc_refresh_token: tokenSet.refresh_token,
    });

    return {
      token,
      user,
      tenant,
    };
  }

  /**
   * Logout oidc user
   * @param {string} idToken
   * @return {string}
   */
  public async generateEndSessionUrl({
    oidcIdToken,
    oidcAccessToken,
  }): Promise<string> | null {
    if (!oidcIdToken || !oidcAccessToken) return null;

    const loggedOutUrl = oidcClient.endSessionUrl({
      id_token_hint: oidcIdToken,
    });

    await oidcClient.revoke(oidcAccessToken, 'access_token');

    return loggedOutUrl;
  }
}
