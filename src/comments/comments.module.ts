import { Module, forwardRef } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './comment.entity';
import { PostsModule } from 'src/posts/posts.module';
import { CommentRepository } from './comments.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Comment]), forwardRef(() => PostsModule)],
  controllers: [CommentsController],
  providers: [CommentsService, CommentRepository],
  exports: [CommentsService],
})
export class CommentsModule {}
