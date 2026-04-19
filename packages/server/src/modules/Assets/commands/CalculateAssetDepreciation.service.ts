import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Asset } from '../models/Asset.model';
import { AssetRepository } from '../repositories/Asset.repository';
import { AssetDepreciationEntryRepository } from '../repositories/AssetDepreciationEntry.repository';
import { events } from '@/common/events/events';

interface DepreciationEntryData {
  assetId: number;
  depreciationDate: string;
  periodYear: number;
  periodMonth: number;
  depreciationAmount: number;
  accumulatedDepreciation: number;
  bookValue: number;
  isPosted: boolean;
}

@Injectable()
export class CalculateAssetDepreciationService {
  constructor(
    private readonly assetRepository: AssetRepository,
    private readonly depreciationEntryRepository: AssetDepreciationEntryRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * Calculate depreciation schedule for an asset.
   */
  public async calculateDepreciationSchedule(assetId: number): Promise<void> {
    const asset = await this.assetRepository.findById(assetId);
    if (!asset) {
      throw new Error(`Asset with id ${assetId} not found`);
    }

    // Check if asset can be depreciated
    if (asset.status !== 'active' && asset.status !== 'fully_depreciated') {
      throw new Error('Cannot calculate depreciation for disposed or inactive assets');
    }

    // Clear existing unposted entries
    await this.depreciationEntryRepository.deleteUnpostedEntries(assetId);

    // Calculate based on method
    switch (asset.depreciationMethod) {
      case 'straight_line':
        await this.calculateStraightLineDepreciation(asset);
        break;
      case 'declining_balance':
        await this.calculateDecliningBalanceDepreciation(asset);
        break;
      default:
        throw new Error(`Depreciation method ${asset.depreciationMethod} not implemented`);
    }

    // Emit event
    this.eventEmitter.emit(events.assets.onDepreciationCalculated, {
      assetId,
    });
  }

  /**
   * Calculate straight-line depreciation.
   */
  private async calculateStraightLineDepreciation(asset: Asset): Promise<void> {
    const usefulLife = asset.usefulLifeYears || 5;
    const depreciableAmount = asset.purchasePrice - asset.residualValue - asset.openingDepreciation;

    if (depreciableAmount <= 0) return;

    const annualDepreciation = depreciableAmount / usefulLife;
    const monthlyDepreciation = annualDepreciation / 12;

    let accumulatedDepreciation = asset.openingDepreciation;
    let bookValue = asset.purchasePrice - accumulatedDepreciation;

    const startDate = new Date(asset.depreciationStartDate);
    const endDate = new Date(startDate);
    endDate.setFullYear(endDate.getFullYear() + usefulLife);

    let currentDate = new Date(startDate);
    const entries: DepreciationEntryData[] = [];

    while (currentDate < endDate && bookValue > asset.residualValue) {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;

      // Adjust final period if needed
      let periodDepreciation = monthlyDepreciation;
      if (bookValue - periodDepreciation < asset.residualValue) {
        periodDepreciation = bookValue - asset.residualValue;
      }

      accumulatedDepreciation += periodDepreciation;
      bookValue -= periodDepreciation;

      entries.push({
        assetId: asset.id,
        depreciationDate: currentDate.toISOString().split('T')[0],
        periodYear: year,
        periodMonth: month,
        depreciationAmount: Math.round(periodDepreciation * 100) / 100,
        accumulatedDepreciation: Math.round(accumulatedDepreciation * 100) / 100,
        bookValue: Math.round(bookValue * 100) / 100,
        isPosted: false,
      });

      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    // Bulk insert entries
    for (const entry of entries) {
      await this.depreciationEntryRepository.create(entry);
    }
  }

  /**
   * Calculate declining balance depreciation.
   */
  private async calculateDecliningBalanceDepreciation(asset: Asset): Promise<void> {
    const rate = asset.depreciationRate ? asset.depreciationRate / 100 : 0.2;
    const maxYears = asset.usefulLifeYears || 10;

    let bookValue = asset.purchasePrice - asset.openingDepreciation;
    let accumulatedDepreciation = asset.openingDepreciation;

    const startDate = new Date(asset.depreciationStartDate);
    let currentDate = new Date(startDate);
    const endDate = new Date(startDate);
    endDate.setFullYear(endDate.getFullYear() + maxYears);

    const entries: DepreciationEntryData[] = [];

    while (currentDate < endDate && bookValue > asset.residualValue) {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;

      let periodDepreciation = (bookValue * rate) / 12;

      // Adjust for final period
      if (bookValue - periodDepreciation < asset.residualValue) {
        periodDepreciation = bookValue - asset.residualValue;
      }

      accumulatedDepreciation += periodDepreciation;
      bookValue -= periodDepreciation;

      entries.push({
        assetId: asset.id,
        depreciationDate: currentDate.toISOString().split('T')[0],
        periodYear: year,
        periodMonth: month,
        depreciationAmount: Math.round(periodDepreciation * 100) / 100,
        accumulatedDepreciation: Math.round(accumulatedDepreciation * 100) / 100,
        bookValue: Math.round(bookValue * 100) / 100,
        isPosted: false,
      });

      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    // Bulk insert entries
    for (const entry of entries) {
      await this.depreciationEntryRepository.create(entry);
    }
  }

  /**
   * Post depreciation for a specific period.
   */
  public async postPeriodDepreciation(year: number, month: number): Promise<number> {
    const entries = await this.depreciationEntryRepository.findUnpostedByPeriod(year, month);

    let postedCount = 0;
    for (const entry of entries) {
      // Emit event for journal entry creation
      this.eventEmitter.emit(events.assets.onDepreciationPost, {
        entryId: entry.id,
        assetId: entry.assetId,
        year,
        month,
      });
      postedCount++;
    }

    return postedCount;
  }
}
