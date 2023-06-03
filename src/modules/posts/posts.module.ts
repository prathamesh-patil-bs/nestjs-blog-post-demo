import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Post } from '@modules/posts/post.entity';
import { PostsService } from '@modules/posts/posts.service';
import { PostRepository } from '@modules/posts/posts.repository';
import { PostsController } from '@modules/posts/posts.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Post])],
  controllers: [PostsController],
  providers: [PostsService, PostRepository],
  exports: [PostsService],
})
export class PostsModule {}
