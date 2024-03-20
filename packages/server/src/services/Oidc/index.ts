import config from '@/config';
import {
  authorizationUrlParameters,
  tokenGrantBody,
} from '@/config/oidcConfig';
import { ISystemUser, ITenant } from '@/interfaces';
import { oidcClient } from '@/lib/Oidc/OidcClient';
import TenantsManagerService from '@/services/Tenancy/TenantsManager';
import { Tenant } from '@/system/models';
import { cloneDeep } from 'lodash';
import moment from 'moment';
import {
  IntrospectionResponse,
  TokenSet,
  UnknownObject,
  UserinfoResponse,
} from 'openid-client';
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
   * Introspect access token
   * @param {string} accessToken
   * @return {Promise<IntrospectionResponse>}
   */
  public async introspectAccessToken(
    accessToken: string
  ): Promise<IntrospectionResponse> {
    const introspectionResponse = await oidcClient.introspect(accessToken);

    return introspectionResponse;
  }

  /**
   * Get user info by access token
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

    const token = accessToken;
    return {
      token,
      user,
      tenant,
    };
  }

  /**
   * Logout oidc user
   * @param {string} oidcAccessToken
   * @return {string}
   */
  public async generateEndSessionUrl(
    oidcAccessToken: string
  ): Promise<string> | null {
    if (!oidcAccessToken) return null;

    const loggedOutUrl = oidcClient.endSessionUrl({
      id_token_hint: {
        access_token: oidcAccessToken,
      },
    });

    await oidcClient.revoke(oidcAccessToken, 'access_token');

    return loggedOutUrl;
  }
}
