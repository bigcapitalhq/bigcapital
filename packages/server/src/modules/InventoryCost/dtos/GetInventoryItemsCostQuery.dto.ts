import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

const transformItemsIds = ({ value }) => {
  if (value == null || value === '') {
    return value;
  }
  const itemsIds = Array.isArray(value) ? value : String(value).split(',');

  return itemsIds
    .map((id: string) => Number(id))
    .filter((id) => !Number.isNaN(id));
};

export class GetInventoyItemsCostQueryDto {
  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The date to get the inventory cost for',
    example: '2021-01-01',
  })
  date: Date;

  @IsArray()
  @IsNotEmpty()
  @ArrayMinSize(1)
  @Transform(transformItemsIds)
  @ApiProperty({
    description: 'The ids of the items to get the inventory cost for',
    example: [1, 2, 3],
  })
  itemsIds: Array<number>;
}
