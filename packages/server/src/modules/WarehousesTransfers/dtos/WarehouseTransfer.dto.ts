import { ToNumber } from '@/common/decorators/Validators';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDecimal,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
  ArrayMinSize,
  IsDateString,
} from 'class-validator';

export class WarehouseTransferEntryDto {
  @IsNotEmpty()
  index: number;

  @IsNotEmpty()
  @IsInt()
  itemId: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  quantity: number;

  @IsOptional()
  @IsDecimal()
  cost?: number;
}

export class CommandWarehouseTransferDto {
  @IsNotEmpty()
  @ToNumber()
  @IsInt()
  @ApiProperty({
    description: 'The id of the warehouse to transfer from',
    example: 1,
  })
  fromWarehouseId: number;

  @IsNotEmpty()
  @ToNumber()
  @IsInt()
  @ApiProperty({
    description: 'The id of the warehouse to transfer to',
    example: 2,
  })
  toWarehouseId: number;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({
    description: 'The date of the warehouse transfer',
    example: '2021-01-01',
  })
  date: Date;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'The transaction number of the warehouse transfer',
    example: '123456',
  })
  transactionNumber?: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description: 'Whether the warehouse transfer has been initiated',
    example: false,
  })
  transferInitiated: boolean = false;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description: 'Whether the warehouse transfer has been delivered',
    example: false,
  })
  transferDelivered: boolean = false;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => WarehouseTransferEntryDto)
  @ApiProperty({
    description: 'The entries of the warehouse transfer',
    example: [
      {
        index: 1,
        itemId: 1,
        description: 'This is a description',
        quantity: 100,
        cost: 100,
      },
    ],
  })
  entries: WarehouseTransferEntryDto[];
}

export class CreateWarehouseTransferDto extends CommandWarehouseTransferDto {}
export class EditWarehouseTransferDto extends CommandWarehouseTransferDto {}
