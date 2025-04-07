import FormData from 'form-data';
import { GotenbergUtils } from './GotenbergUtils';
import { PageProperties } from './_types';

export class ConverterUtils {
  public static injectPageProperties(
    data: FormData,
    pageProperties: PageProperties
  ): void {
    if (pageProperties.size) {
      GotenbergUtils.assert(
        pageProperties.size.width >= 1.0 && pageProperties.size.height >= 1.5,
        'size is smaller than the minimum printing requirements (i.e. 1.0 x 1.5 in)'
      );

      data.append('paperWidth', pageProperties.size.width);
      data.append('paperHeight', pageProperties.size.height);
    }
    if (pageProperties.margins) {
      GotenbergUtils.assert(
        pageProperties.margins.top >= 0 &&
          pageProperties.margins.bottom >= 0 &&
          pageProperties.margins.left >= 0 &&
          pageProperties.margins.left >= 0,
        'negative margins are not allowed'
      );
      data.append('marginTop', pageProperties.margins.top);
      data.append('marginBottom', pageProperties.margins.bottom);
      data.append('marginLeft', pageProperties.margins.left);
      data.append('marginRight', pageProperties.margins.right);
    }
    if (pageProperties.preferCssPageSize) {
      data.append(
        'preferCssPageSize',
        String(pageProperties.preferCssPageSize)
      );
    }
    if (pageProperties.printBackground) {
      data.append('printBackground', String(pageProperties.printBackground));
    }
    if (pageProperties.landscape) {
      data.append('landscape', String(pageProperties.landscape));
    }
    if (pageProperties.scale) {
      GotenbergUtils.assert(
        pageProperties.scale >= 0.1 && pageProperties.scale <= 2.0,
        'scale is outside of [0.1 - 2] range'
      );
      data.append('scale', pageProperties.scale);
    }

    if (pageProperties.nativePageRanges) {
      GotenbergUtils.assert(
        pageProperties.nativePageRanges.from > 0 &&
          pageProperties.nativePageRanges.to > 0 &&
          pageProperties.nativePageRanges.to >=
            pageProperties.nativePageRanges.from,
        'page ranges syntax error'
      );
      data.append(
        'nativePageRanges',
        `${pageProperties.nativePageRanges.from}-${pageProperties.nativePageRanges.to}`
      );
    }
  }
}
