import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { TCurrentUser } from 'src/users/types/current-user.type';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Comment } from './comment.entity';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { CommentDto } from './dtos/comment.dto';
import { ApiUnauthorizedResponseDto } from 'src/common/api-responses/ApiUnauthorizeResponse.dto';
import { ApiNotFoundResponseDto } from 'src/common/api-responses/ApiNotFoundResponse.dto';
import { ApiSuccessResponseDto } from 'src/common/api-responses/ApiSuccessResponseDto';

@UseGuards(JwtAuthGuard)
@Controller('/users/:userId/posts/:postId/comments')
@ApiTags('Comments')
@ApiBearerAuth()
export class CommentsController {
  constructor(private readonly commentService: CommentsService) {}

  @Get()
  @Serialize(CommentDto)
  @ApiParam({ name: 'userId', description: 'Id of the user.' })
  @ApiParam({ name: 'postId', description: 'Id of the post.' })
  @ApiResponse({
    status: 200,
    description: 'Returns the list of comments made on a post.',
    type: CommentDto,
    isArray: true,
  })
  @ApiUnauthorizedResponse({ type: ApiUnauthorizedResponseDto })
  @ApiNotFoundResponse({ type: ApiNotFoundResponseDto })
  getCommentsOfPost(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('postId', ParseIntPipe) postId: number,
  ): Promise<Array<Comment>> {
    return this.commentService.getCommentsOfPost(userId, postId);
  }

  @Get(':commentId')
  @Serialize(CommentDto)
  @ApiParam({ name: 'userId', description: 'Id of the user.' })
  @ApiParam({ name: 'postId', description: 'Id of the post.' })
  @ApiParam({ name: 'commentId', description: 'Id of the comment.' })
  @ApiResponse({
    status: 200,
    description: "Returns the comments made on a post identified by it's id.",
    type: CommentDto,
  })
  @ApiUnauthorizedResponse({ type: ApiUnauthorizedResponseDto })
  @ApiNotFoundResponse({ type: ApiNotFoundResponseDto })
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

    if (!comment) {
      throw new NotFoundException(
        `No such comment exists with id: ${commentId}`,
      );
    }

    return this.commentService.getCommentById(userId, postId, commentId);
  }

  @Post()
  @HttpCode(200)
  @Serialize(CommentDto)
  @ApiParam({ name: 'userId', description: 'Id of the user.' })
  @ApiParam({ name: 'postId', description: 'Id of the post.' })
  @ApiResponse({
    status: 200,
    description: 'Returns the created comment object.',
    type: CommentDto,
  })
  @ApiUnauthorizedResponse({ type: ApiUnauthorizedResponseDto })
  @ApiNotFoundResponse({ type: ApiNotFoundResponseDto })
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
  @ApiParam({ name: 'userId', description: 'Id of the user.' })
  @ApiParam({ name: 'postId', description: 'Id of the post.' })
  @ApiParam({ name: 'commentId', description: 'Id of the comment.' })
  @ApiResponse({
    status: 200,
    description: 'Returns the success response of comment deletion.',
    type: ApiSuccessResponseDto,
  })
  @ApiUnauthorizedResponse({ type: ApiUnauthorizedResponseDto })
  @ApiNotFoundResponse({ type: ApiNotFoundResponseDto })
  deleteComment(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('postId', ParseIntPipe) postId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
    @CurrentUser() user: TCurrentUser,
  ): Promise<{ message: string }> {
    return this.commentService.deleteComment(user, userId, postId, commentId);
  }
}
