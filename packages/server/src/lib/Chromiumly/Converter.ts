import { Chromiumly } from './Chromiumly';
import { ChromiumRoute } from './_types';

export abstract class Converter {
  readonly endpoint: string;

  constructor(route: ChromiumRoute) {
    this.endpoint = `${Chromiumly.GOTENBERG_ENDPOINT}/${Chromiumly.CHROMIUM_PATH}/${Chromiumly.CHROMIUM_ROUTES[route]}`;
  }
}
