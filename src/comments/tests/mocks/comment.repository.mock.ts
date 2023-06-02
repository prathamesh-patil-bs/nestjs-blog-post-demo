import { Comment } from 'src/comments/comment.entity';
import {
  DeepPartial,
  DeleteResult,
  FindManyOptions,
  FindOptionsWhere,
} from 'typeorm';

export class CommentRepositoryMock {
  comments: Comment[] = [];

  create(entityLike: DeepPartial<Comment>) {
    return new Comment({
      id: entityLike.id || 1,
      ...entityLike,
      post: { authorId: 1 },
    });
  }

  async save(comment: Comment): Promise<Comment> {
    this.comments.push(comment);
    return comment;
  }

  async getCommentWithPostAndAuthor(
    postId: number,
    commentId: number,
  ): Promise<Comment> {
    return this.comments.find(
      (comment) => comment.id === commentId && comment.postId === postId,
    );
  }

  async find(
    options: FindOptionsWhere<Comment> | FindManyOptions<Comment>,
  ): Promise<Comment[]> {
    const {
      where: { postId = 1 },
    } = options as any;
    return this.comments.filter((comment) => comment.postId === postId);
  }

  async findOneBy({ postId, id }: FindOptionsWhere<Comment>): Promise<Comment> {
    return this.comments.find(
      (comment) => comment.postId === postId && comment.id === id,
    );
  }

  async delete(): Promise<DeleteResult> {
    return {
      raw: 1,
      affected: 1,
    };
  }
}
