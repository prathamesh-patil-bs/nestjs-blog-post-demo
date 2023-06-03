import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PostsModule } from '@modules/posts/posts.module';
import { Comment } from '@modules/comments/comment.entity';
import { CommentsService } from '@modules/comments/comments.service';
import { CommentRepository } from '@modules/comments/comments.repository';
import { CommentsController } from '@modules/comments/comments.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Comment]), PostsModule],
  controllers: [CommentsController],
  providers: [CommentsService, CommentRepository],
  exports: [CommentsService],
})
export class CommentsModule {}
