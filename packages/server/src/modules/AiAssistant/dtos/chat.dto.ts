import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class ChatRequestDto {
  /**
   * Tenant conversation id. Created by the client before the first message.
   */
  @IsInt()
  @Min(1)
  conversationId: number;

  /**
   * AI SDK UI messages. Validated with safeValidateUIMessages in the service.
   */
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(100)
  messages: unknown[];

  @IsOptional()
  @IsIn(['submit-message', 'regenerate-message'])
  trigger?: 'submit-message' | 'regenerate-message';

  @IsOptional()
  @IsString()
  messageId?: string;

  /**
   * AI SDK chat id. Not used server-side, but accepted so the default
   * DefaultChatTransport body is not rejected.
   */
  @IsOptional()
  @IsString()
  id?: string;
}
