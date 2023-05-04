import { Module, forwardRef } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { CommentsModule } from '../comments/comments.module';
import { PostRepository } from './posts.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), forwardRef(() => CommentsModule)],
  controllers: [PostsController],
  providers: [PostsService, PostRepository],
  exports: [PostsService],
})
export class PostsModule {}
