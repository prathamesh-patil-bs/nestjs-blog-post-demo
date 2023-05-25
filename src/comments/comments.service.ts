import {
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { In } from 'typeorm';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { PostsService } from 'src/posts/posts.service';
import { CommentRepository } from './comments.repository';
import { Comment } from './comment.entity';
import { TCurrentUser } from 'src/users/types/current-user.type';
import { USER_ROLE } from 'src/common/app.constants';

@Injectable()
export class CommentsService {
  private logger = new Logger(CommentsService.name);

  constructor(
    private readonly commentRepository: CommentRepository,
    @Inject(forwardRef(() => PostsService))
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
        'Trying to access comment of post which does not exists!',
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

  async deleteCommentsOfPost(postId: number): Promise<void> {
    this.commentRepository.delete({ postId });
  }

  async deleteCommentsOfPosts(postIds: Array<number>): Promise<void> {
    this.commentRepository.delete({ id: In(postIds) });
  }

  async deleteCommentsOfUser(userId: number): Promise<void> {
    this.commentRepository.delete({ userId });
  }
}
