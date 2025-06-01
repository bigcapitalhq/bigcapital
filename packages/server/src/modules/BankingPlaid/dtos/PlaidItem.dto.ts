import { IsNotEmpty, IsString } from 'class-validator';

export class PlaidItemDto {
  @IsString()
  @IsNotEmpty()
  publicToken: string;

  @IsString()
  @IsNotEmpty()
  institutionId: string;
}

export class PlaidWebhookDto {
  @IsString()
  @IsNotEmpty()
  itemId: string;

  @IsString()
  @IsNotEmpty()
  webhookType: string;

  @IsString()
  @IsNotEmpty()
  webhookCode: string;
}
  