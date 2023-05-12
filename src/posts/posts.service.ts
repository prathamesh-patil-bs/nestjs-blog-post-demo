import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { PostRepository } from './posts.repository';
import { CreatePostDto } from './dtos/create-post.dto';
import { TCurrentUser } from 'src/users/types/current-user.type';
import { UpdatePostDto } from './dtos/update-post.dto';
import { USER_ROLE } from 'src/common/app.constants';
import { CommentsService } from 'src/comments/comments.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private readonly postsRepository: PostRepository,
    @Inject(forwardRef(() => CommentsService))
    private readonly commentService: CommentsService,
  ) {}

  fetchPostOfUser(userId: number): Promise<Array<Post>> {
    return this.postsRepository.findBy({ authorId: userId });
  }

  async fetchPostOfUserById(userId: number, postId: number): Promise<Post> {
    const post = await this.postsRepository.findOneBy({
      id: postId,
      authorId: userId,
    });

    return post;
  }

  createPost(user: TCurrentUser, createPostDto: CreatePostDto): Promise<Post> {
    const post = this.postsRepository.create({
      ...createPostDto,
      author: user,
    });

    return this.postsRepository.save(post);
  }

  async updatePost(
    userId: number,
    postId: number,
    updatePostDto: UpdatePostDto,
  ): Promise<Post> {
    const post = await this.postsRepository.findOneBy({
      id: postId,
      authorId: userId,
    });

    if (!post)
      throw new NotFoundException(`No such post found with id : ${postId}`);

    return this.postsRepository.save({ ...post, ...updatePostDto });
  }

  async deletePost(
    user: TCurrentUser,
    userId: number,
    postId: number,
  ): Promise<{ message: string }> {
    const post = await this.fetchPostOfUserById(userId, postId);

    if (!post) {
      throw new NotFoundException(`No such post found with id : ${postId}`);
    }

    const isUserAdmin = user.role === USER_ROLE.ADMIN;
    const isUserOwnsPost = user.id === post.authorId;

    if (!isUserAdmin && !isUserOwnsPost) {
      throw new UnauthorizedException();
    }

    await this.postsRepository.delete({ id: postId });

    return { message: 'Post deleted successfully.' };
  }

  async deletePostsOfUser(userId: number): Promise<void> {
    const posts = await this.fetchPostOfUser(userId);
    await this.commentService.deleteCommentsOfPosts(
      posts.map((post) => post.id),
    );
  }
}
