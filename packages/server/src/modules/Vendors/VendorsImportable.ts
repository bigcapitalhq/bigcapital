import { Knex } from 'knex';
import { VendorsSampleData } from './_SampleData';
import { Injectable } from '@nestjs/common';
import { Importable } from '../Import/Importable';
import { ImportableService } from '../Import/decorators/Import.decorator';
import { CreateVendorService } from './commands/CreateVendor.service';
import { CreateVendorDto } from './dtos/CreateVendor.dto';
import { Vendor } from './models/Vendor';

@Injectable()
@ImportableService({ name: Vendor.name })
export class VendorsImportable extends Importable {
  constructor(private readonly createVendorService: CreateVendorService) {
    super();
  }

  /**
   * Maps the imported data to create a new vendor service.
   * @param {CreateVendorDto} createDTO
   * @param {Knex.Transaction} trx
   */
  public async importable(
    createDTO: CreateVendorDto,
    trx?: Knex.Transaction<any, any[]>,
  ): Promise<void> {
    await this.createVendorService.createVendor(createDTO, trx);
  }

  /**
   * Retrieves the sample data of vendors sample sheet.
   */
  public sampleData(): any[] {
    return VendorsSampleData;
  }
}
