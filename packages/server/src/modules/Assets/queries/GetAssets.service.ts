import { Injectable } from '@nestjs/common';
import { Asset } from '../models/Asset.model';
import { AssetRepository } from '../repositories/Asset.repository';
import { GetAssetsQueryDto } from '../dtos/GetAssetsQuery.dto';

interface IFilterMeta {
  total: number;
  pagesCount: number;
}

@Injectable()
export class GetAssetsService {
  constructor(
    private readonly assetRepository: AssetRepository,
  ) {}

  /**
   * Get paginated list of assets.
   */
  public async getAssetsList(
    query: GetAssetsQueryDto,
  ): Promise<{ assets: Asset[]; filterMeta: IFilterMeta }> {
    const { assets, total } = await this.assetRepository.getAssets({
      q: query.q,
      status: query.status,
      assetAccountId: query.assetAccountId,
      page: query.page,
      pageSize: query.pageSize,
    });

    const pagesCount = Math.ceil(total / (query.pageSize || 20));

    return {
      assets,
      filterMeta: {
        total,
        pagesCount,
      },
    };
  }
}
