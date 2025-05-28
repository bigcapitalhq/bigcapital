import { IsNotEmpty, IsString } from 'class-validator';

export class PlaidItemDto {
  @IsString()
  @IsNotEmpty()
  publicToken: string;

  @IsString()
  @IsNotEmpty()
  institutionId: string;
}
