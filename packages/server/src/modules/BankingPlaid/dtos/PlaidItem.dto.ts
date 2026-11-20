import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { PlaidItemAccountLinkDto } from './PlaidItemAccountLink.dto';

export class PlaidItemDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '123', description: 'The public token' })
  publicToken: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '123', description: 'The institution ID' })
  institutionId: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PlaidItemAccountLinkDto)
  @ApiProperty({
    type: [PlaidItemAccountLinkDto],
    required: false,
    description:
      'Plaid accounts to link to existing accounts instead of creating new ones',
  })
  accounts?: PlaidItemAccountLinkDto[];
}

export class PlaidWebhookDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '123', description: 'The Plaid item ID' })
  itemId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '123', description: 'The Plaid webhook type' })
  webhookType: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '123', description: 'The Plaid webhook code' })
  webhookCode: string;
}
