import {
  Logger,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { USER_ROLE } from '@common/app.constants';
import { Comment } from '@modules/comments/comment.entity';
import { PostsService } from '@modules/posts/posts.service';
import { TCurrentUser } from '@modules/users/typings/current-user.type';
import { CommentRepository } from '@modules/comments/comments.repository';
import { CreateCommentDto } from '@modules/comments/dtos/create-comment.dto';

@Injectable()
export class CommentsService {
  private logger = new Logger(CommentsService.name);

  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly postService: PostsService,
  ) {}

  async getCommentsOfPost(
    userId: number,
    postId: number,
  ): Promise<Array<Comment>> {
    const post = await this.postService.fetchPostOfUserById(userId, postId);
    if (!post) {
      this.logger.warn(
        'Trying to access comment of post which does not exists!',
        { userId, postId },
      );
      throw new NotFoundException(`No such post exists with id : ${postId}`);
    }

    return this.commentRepository.find({ where: { postId } });
  }

  async getCommentById(
    userId: number,
    postId: number,
    commentId: number,
  ): Promise<Comment> {
    const post = await this.postService.fetchPostOfUserById(userId, postId);

    if (!post) {
      this.logger.warn(
        'Trying to access comment of post which does not exists!',
        { userId, postId },
      );
      throw new NotFoundException(`No such post exists with id : ${postId}`);
    }

    return this.commentRepository.findOneBy({ postId, id: commentId });
  }

  async createComment(
    user: TCurrentUser,
    userId: number,
    postId: number,
    createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    const post = await this.postService.fetchPostOfUserById(userId, postId);

    if (!post) {
      this.logger.warn(
        'Trying to create comment on post which does not exists!',
        { userId, postId },
      );
      throw new NotFoundException(`No such post exists with id : ${postId}`);
    }

    const comment = this.commentRepository.create({
      ...createCommentDto,
      userId: user.id,
      postId,
    });

    return await this.commentRepository.save(comment);
  }

  async deleteComment(
    user: TCurrentUser,
    userId: number,
    postId: number,
    commentId: number,
  ): Promise<{ message: string }> {
    const commentInfo =
      await this.commentRepository.getCommentWithPostAndAuthor(
        postId,
        commentId,
      );

    if (!commentInfo) {
      this.logger.warn('Trying to delete comment which does not exists!', {
        userId,
        postId,
      });
      throw new NotFoundException(
        `No such comment exists with id : ${commentId}`,
      );
    }

    const isUserAdmin = user.role === USER_ROLE.ADMIN;
    const isUserOwnsPost = commentInfo.post.authorId === user.id;
    const isUserOwnsComment = commentInfo.userId === user.id;

    if (!isUserAdmin && !isUserOwnsPost && !isUserOwnsComment) {
      throw new UnauthorizedException();
    }

    await this.commentRepository.delete({ id: commentId });
    return { message: 'Comment deleted successfully!' };
  }
}
