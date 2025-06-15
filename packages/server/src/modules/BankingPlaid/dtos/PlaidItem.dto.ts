import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class PlaidItemDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '123', description: 'The public token' })
  publicToken: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '123', description: 'The institution ID' })
  institutionId: string;
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
