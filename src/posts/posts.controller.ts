import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { Post as PostEntity } from './post.entity';
import { CreatePostDto } from './dtos/create-post.dto';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { TCurrentUser } from 'src/users/types/current-user.type';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdatePostDto } from './dtos/update-post.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { PostDto } from './dtos/post.dto';

@UseGuards(JwtAuthGuard)
@Controller('/users/:userId/posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @Get()
  @Serialize(PostDto)
  getAllPosts(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<Array<PostEntity>> {
    return this.postService.fetchPostOfUser(userId);
  }

  @Get(':postId')
  @Serialize(PostDto)
  getPostById(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('postId', ParseIntPipe) postId: number,
  ): Promise<PostEntity> {
    return this.postService.fetchPostOfUserById(userId, postId);
  }

  @Post()
  @Serialize(PostDto)
  createPost(
    @Param('userId', ParseIntPipe) userId: number,
    @CurrentUser() user: TCurrentUser,
    @Body() createPostDto: CreatePostDto,
  ): Promise<PostEntity> {
    if (userId !== user.id) throw new UnauthorizedException();
    return this.postService.createPost(user, createPostDto);
  }

  @Put(':postId')
  @Serialize(PostDto)
  updatePost(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('postId', ParseIntPipe) postId: number,
    @Body() updatePostDto: UpdatePostDto,
    @CurrentUser() user: TCurrentUser,
  ): Promise<PostEntity> {
    if (userId !== user.id) throw new UnauthorizedException();
    return this.postService.updatePost(userId, postId, updatePostDto);
  }

  @Delete(':postId')
  @Serialize(PostDto)
  deletePost(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('postId', ParseIntPipe) postId: number,
    @CurrentUser() user: TCurrentUser,
  ): Promise<{ message: string }> {
    return this.postService.deletePost(user, userId, postId);
  }
}
