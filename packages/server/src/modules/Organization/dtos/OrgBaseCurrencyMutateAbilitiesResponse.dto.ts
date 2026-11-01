import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class OrgBaseCurrencyMutateLockDto {
  @ApiProperty({
    description: 'The model name that prevents base currency mutation',
    example: 'SaleInvoice',
  })
  modelName: string;

  @ApiProperty({
    description: 'The plural display name of the model',
    example: 'Sale Invoices',
    required: false,
  })
  pluralName?: string;
}

export class OrgBaseCurrencyMutateAbilitiesResponseDto {
  @ApiProperty({
    description: 'List of models preventing base currency mutation',
    type: [OrgBaseCurrencyMutateLockDto],
  })
  @Type(() => OrgBaseCurrencyMutateLockDto)
  abilities: OrgBaseCurrencyMutateLockDto[];
}
