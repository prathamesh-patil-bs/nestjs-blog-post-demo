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

@UseGuards(JwtAuthGuard)
@Controller('/users/:userId/posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @Get()
  getAllPosts(): Promise<Array<PostEntity>> {
    return this.postService.fetchAllPosts();
  }

  @Get(':postId')
  getPostById(
    @Param('postId', ParseIntPipe) postId: number,
  ): Promise<PostEntity> {
    return this.postService.fetchPostById(postId);
  }

  @Post()
  createPost(
    @Param('userId', ParseIntPipe) userId: number,
    @CurrentUser() user: TCurrentUser,
    @Body() createPostDto: CreatePostDto,
  ) {
    if (userId !== user.id) throw new UnauthorizedException();
    return this.postService.createPost(user, createPostDto);
  }

  // @Put(':postId')
  // updatePost() {}

  // @Delete(':postId')
  // deletePost() {}
}
