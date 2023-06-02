import { Post } from 'src/posts/post.entity';
import { DeepPartial, DeleteResult, FindOptionsWhere } from 'typeorm';

export class PostRepositoryMock {
  posts: Post[] = [];

  create(entityLike: DeepPartial<Post>): Post {
    const { text, title, author } = entityLike;
    return new Post({
      id: 1,
      text,
      title,
      authorId: author.id,
      author,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  async save(post: Post): Promise<Post> {
    this.posts.push(post);
    return post;
  }

  async findBy(options: FindOptionsWhere<Post>): Promise<Post[]> {
    const { authorId } = options;
    return this.posts.filter((post) => post.authorId === authorId);
  }

  async findOneBy(options: FindOptionsWhere<Post>): Promise<Post> {
    const { id, authorId } = options;
    return this.posts.find(
      (post) => post.authorId === authorId && post.id === id,
    );
  }

  async delete(criteria: FindOptionsWhere<Post>): Promise<DeleteResult> {
    return {
      raw: 1,
      affected: 1,
    };
  }
}
