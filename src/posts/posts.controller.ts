import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UnauthorizedException,
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
import { PostDto } from './dtos/post.dto';
import { PostsService } from './posts.service';
import { Post as PostEntity } from './post.entity';
import { CreatePostDto } from './dtos/create-post.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdatePostDto } from './dtos/update-post.dto';
import { TCurrentUser } from 'src/users/types/current-user.type';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { ApiUnauthorizedResponseDto } from 'src/common/api-responses/ApiUnauthorizeResponse.dto';
import { ApiNotFoundResponseDto } from 'src/common/api-responses/ApiNotFoundResponse.dto';
import { ApiSuccessResponseDto } from 'src/common/api-responses/ApiSuccessResponseDto';

@UseGuards(JwtAuthGuard)
@Controller('/users/:userId/posts')
@ApiTags('Posts')
@ApiBearerAuth()
export class PostsController {
  private logger = new Logger(PostsController.name);
  constructor(private readonly postService: PostsService) {}

  @Get()
  @Serialize(PostDto)
  @ApiParam({ name: 'userId', description: 'Id of the user.' })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of posts created by user.',
    isArray: true,
    type: PostDto,
  })
  @ApiUnauthorizedResponse({ type: ApiUnauthorizedResponseDto })
  getAllPosts(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<Array<PostEntity>> {
    return this.postService.fetchPostOfUser(userId);
  }

  @Get(':postId')
  @Serialize(PostDto)
  @ApiParam({ name: 'userId', description: 'Id of the user.' })
  @ApiParam({ name: 'postId', description: 'Id of the post.' })
  @ApiResponse({
    status: 200,
    description: 'Returns the post identified by id.',
    type: PostDto,
  })
  @ApiUnauthorizedResponse({ type: ApiUnauthorizedResponseDto })
  @ApiNotFoundResponse({ type: ApiNotFoundResponseDto })
  async getPostById(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('postId', ParseIntPipe) postId: number,
  ): Promise<PostEntity> {
    const post = await this.postService.fetchPostOfUserById(userId, postId);

    if (!post) {
      this.logger.warn("Trying to access post which doesn't exists", {
        postId,
      });
      throw new NotFoundException(`No such post found with id : ${postId}`);
    }

    return post;
  }

  @Post()
  @Serialize(PostDto)
  @HttpCode(200)
  @ApiParam({ name: 'userId', description: 'Id of the user.' })
  @ApiResponse({
    status: 200,
    type: PostDto,
    description: 'Returns the newly created post record.',
  })
  @ApiUnauthorizedResponse({ type: ApiUnauthorizedResponseDto })
  createPost(
    @Param('userId', ParseIntPipe) userId: number,
    @CurrentUser() user: TCurrentUser,
    @Body() createPostDto: CreatePostDto,
  ): Promise<PostEntity> {
    if (userId !== user.id) {
      this.logger.warn('Unauthorized operator of crating post', {
        userId,
        user,
      });
      throw new UnauthorizedException();
    }
    return this.postService.createPost(user, createPostDto);
  }

  @Put(':postId')
  @Serialize(PostDto)
  @HttpCode(200)
  @ApiParam({ name: 'userId', description: 'Id of the user.' })
  @ApiParam({ name: 'postId', description: 'Id of the post.' })
  @ApiResponse({
    status: 200,
    description: 'Returns the updated post object.',
    type: PostDto,
  })
  @ApiUnauthorizedResponse({ type: ApiUnauthorizedResponseDto })
  @ApiNotFoundResponse({ type: ApiNotFoundResponseDto })
  updatePost(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('postId', ParseIntPipe) postId: number,
    @Body() updatePostDto: UpdatePostDto,
    @CurrentUser() user: TCurrentUser,
  ): Promise<PostEntity> {
    if (userId !== user.id) {
      this.logger.warn('Trying to update post of another author', {
        user,
        userId,
      });
      throw new UnauthorizedException();
    }
    return this.postService.updatePost(userId, postId, updatePostDto);
  }

  @Delete(':postId')
  @Serialize(PostDto)
  @ApiParam({ name: 'userId', description: 'Id of the user.' })
  @ApiParam({ name: 'postId', description: 'Id of the post.' })
  @ApiResponse({
    status: 200,
    description: 'Returns the success response of post deletion.',
    type: ApiSuccessResponseDto,
  })
  @ApiUnauthorizedResponse({ type: ApiUnauthorizedResponseDto })
  @ApiNotFoundResponse({ type: ApiNotFoundResponseDto })
  deletePost(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('postId', ParseIntPipe) postId: number,
    @CurrentUser() user: TCurrentUser,
  ): Promise<{ message: string }> {
    return this.postService.deletePost(user, userId, postId);
  }
}
