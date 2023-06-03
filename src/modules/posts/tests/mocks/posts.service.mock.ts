import { Post } from '@modules/posts/post.entity';
import { CreatePostDto } from '@modules/posts/dtos/create-post.dto';
import { TCurrentUser } from '@modules/users/typings/current-user.type';

export class PostServiceMock {
  posts: Post[] = [];

  createPost(currentUser: TCurrentUser, createPostDto: CreatePostDto): Post {
    const post = new Post({
      id: 1,
      ...createPostDto,
      authorId: currentUser.id,
      author: currentUser,
    });
    this.posts.push(post);
    return post;
  }

  async fetchPostOfUserById(userId: number, postId: number): Promise<Post> {
    return this.posts.find(
      (post) => post.id === postId && post.authorId === userId,
    );
  }
}
