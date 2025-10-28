import { ArrayMinSize, IsArray, IsNotEmpty, IsObject, IsString } from "class-validator";
import { AddressItem } from "../MailNotification.types";

export class CommonMailOptionsDto {
  @IsArray()
  @ArrayMinSize(1)
  @IsNotEmpty()
  from: Array<string>;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsNotEmpty()
  to: Array<string>;

  @IsArray()
  cc?: Array<string>;

  @IsArray()
  bcc?: Array<string>;

  @IsObject()
  formatArgs?: Record<string, any>;

  @IsArray()
  toOptions: Array<AddressItem>;

  @IsArray()
  fromOptions: Array<AddressItem>;
}