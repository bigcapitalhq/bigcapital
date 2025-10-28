import { IsNumber, IsOptional, IsString } from 'class-validator';

export class GetContactsAutoCompleteQuery {
  @IsNumber()
  @IsOptional()
  limit: number;

  @IsString()
  @IsOptional()
  keyword: string;
}
