import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { TCurrentUser } from 'src/users/types/current-user.type';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Comment } from './comment.entity';

@UseGuards(JwtAuthGuard)
@Controller('/users/:userId/posts/:postId/comments')
export class CommentsController {
  constructor(private readonly commentService: CommentsService) {}

  @Get()
  getCommentsOfPost(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('postId', ParseIntPipe) postId: number,
  ): Promise<Array<Comment>> {
    return this.commentService.getCommentsOfPost(userId, postId);
  }

  @Get(':commentId')
  async getCommentById(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('postId', ParseIntPipe) postId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
  ): Promise<Comment> {
    const comment = await this.commentService.getCommentById(
      userId,
      postId,
      commentId,
    );
    if (!comment)
      throw new NotFoundException(
        `No such comment exists with id: ${commentId}`,
      );

    return this.commentService.getCommentById(userId, postId, commentId);
  }

  @Post()
  createComment(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('postId', ParseIntPipe) postId: number,
    @Body() createCommentDto: CreateCommentDto,
    @CurrentUser() user: TCurrentUser,
  ): Promise<Comment> {
    return this.commentService.createComment(
      user,
      userId,
      postId,
      createCommentDto,
    );
  }

  @Delete(':commentId')
  deleteComment(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('postId', ParseIntPipe) postId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
    @CurrentUser() user: TCurrentUser,
  ): Promise<{ message: string }> {
    return this.commentService.deleteComment(user, userId, postId, commentId);
  }
}
