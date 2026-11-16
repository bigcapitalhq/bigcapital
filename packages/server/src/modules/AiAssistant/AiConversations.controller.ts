import {
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { ClsService } from 'nestjs-cls';
import { SkipSerialize } from '@/common/decorators/SkipSerialize.decorator';
import { AuthorizationGuard } from '@/modules/Roles/Authorization.guard';
import { AiAccessGuard } from './AiAccess.guard';
import { AiConversationService } from './AiConversation.service';

@Controller('ai/conversations')
@ApiExcludeController()
@SkipSerialize()
@UseGuards(AuthorizationGuard, AiAccessGuard)
export class AiConversationsController {
  constructor(
    private readonly conversationService: AiConversationService,
    private readonly clsService: ClsService,
  ) {}

  /**
   * Lists the current user's conversations.
   */
  @Get()
  public async list() {
    const conversations = await this.conversationService.list(this.getUserId());
    return { data: conversations };
  }

  /**
   * Creates an empty conversation. The client calls this before the first
   * message so it can send the conversation id with the stream request.
   */
  @Post()
  public async create() {
    const conversation = await this.conversationService.create(
      this.getUserId(),
    );
    return {
      id: conversation.id,
      title: conversation.title,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
    };
  }

  /**
   * Returns a conversation with its messages, in AI SDK UIMessage shape.
   */
  @Get(':id')
  public async get(@Param('id', ParseIntPipe) id: number) {
    return this.conversationService.getWithMessages(this.getUserId(), id);
  }

  /**
   * Deletes a conversation and all of its messages.
   */
  @Delete(':id')
  @HttpCode(204)
  public async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.conversationService.delete(this.getUserId(), id);
  }

  private getUserId(): number {
    const userId = this.clsService.get<number>('userId');
    if (!userId) {
      throw new ForbiddenException('The authenticated user was not found.');
    }
    return userId;
  }
}
