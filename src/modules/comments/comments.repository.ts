import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

import { Comment } from '@modules/comments/comment.entity';

@Injectable()
export class CommentRepository extends Repository<Comment> {
  constructor(private readonly dataSource: DataSource) {
    super(Comment, dataSource.createEntityManager());
  }

  getCommentWithPostAndAuthor(
    postId: number,
    commentId: number,
  ): Promise<Comment> {
    return this.findOne({
      where: { postId, id: commentId },
      relations: ['user', 'post'],
      select: ['id', 'post', 'user'],
    });
  }
}
