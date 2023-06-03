import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

import { PostsService } from '@modules/posts/posts.service';
import { CreatePostDto } from '@modules/posts/dtos/create-post.dto';
import { CommentsService } from '@modules/comments/comments.service';
import { TCurrentUser } from '@modules/users/typings/current-user.type';
import { CommentRepository } from '@modules/comments/comments.repository';
import { CreateCommentDto } from '@modules/comments/dtos/create-comment.dto';
import { PostServiceMock } from '@modules/posts/tests/mocks/posts.service.mock';
import { CommentRepositoryMock } from '@modules/comments/tests/mocks/comment.repository.mock';

describe('CommentService', () => {
  let commentService: CommentsService;
  let postsService: PostsService;

  const currentUser: TCurrentUser = {
    id: 1,
    firstName: 'prathamesh',
    lastName: 'patil',
    email: 'prathamesh@gmail.com',
    role: 'user',
  };

  const createPostDto: CreatePostDto = {
    text: 'Test Text',
    title: 'Test Title',
  };

  const createCommentDto: CreateCommentDto = {
    text: 'test-comment.',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        {
          provide: CommentRepository,
          useClass: CommentRepositoryMock,
        },
        {
          provide: PostsService,
          useClass: PostServiceMock,
        },
      ],
    }).compile();

    commentService = module.get<CommentsService>(CommentsService);
    postsService = module.get<PostsService>(PostsService);
  });

  describe('Define', () => {
    it('Should define the commentService', () => {
      expect(commentService).toBeDefined();
      expect(postsService).toBeDefined();
    });
  });

  describe('createComment', () => {
    it('Should throw NotFoundException on invalid postId', async () => {
      await expect(
        commentService.createComment(currentUser, 1, 1, createCommentDto),
      ).rejects.toThrow(NotFoundException);
      await expect(
        commentService.createComment(currentUser, 1, 1, createCommentDto),
      ).rejects.toThrow(
        new NotFoundException('No such post exists with id : 1'),
      );
    });

    it('Should create comment on given post', async () => {
      await postsService.createPost(currentUser, createPostDto);
      const result = await commentService.createComment(
        currentUser,
        1,
        1,
        createCommentDto,
      );

      expect(result).toBeDefined();
      expect(result).toHaveProperty('id', 1);
    });
  });

  describe('getCommentsOfPost', () => {
    it('Should throw NotFoundException', async () => {
      await expect(commentService.getCommentsOfPost(1, 1)).rejects.toThrow(
        NotFoundException,
      );
      await expect(commentService.getCommentsOfPost(1, 1)).rejects.toThrow(
        new NotFoundException(`No such post exists with id : 1`),
      );
    });

    it('Should return list of comments', async () => {
      await postsService.createPost(currentUser, createPostDto);
      await commentService.createComment(currentUser, 1, 1, createCommentDto);

      const result = await commentService.getCommentsOfPost(1, 1);

      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty('id', 1);
    });
  });

  describe('getCommentById', () => {
    it('Should throw NotFoundException', async () => {
      await expect(commentService.getCommentById(1, 2, 3)).rejects.toThrow(
        NotFoundException,
      );
      await expect(commentService.getCommentById(1, 2, 3)).rejects.toThrow(
        new NotFoundException(`No such post exists with id : 2`),
      );
    });

    it('Should return the comment', async () => {
      await postsService.createPost(currentUser, createPostDto);
      await commentService.createComment(currentUser, 1, 1, createCommentDto);

      const result = await commentService.getCommentById(1, 1, 1);

      expect(result).toBeDefined();
      expect(result).toHaveProperty('id', 1);
      expect(result).toHaveProperty('text', 'test-comment.');
    });
  });

  describe('deleteComment', () => {
    it('Should throw NotFoundException', async () => {
      await expect(
        commentService.deleteComment(currentUser, 1, 1, 1),
      ).rejects.toThrow(NotFoundException);
      await expect(
        commentService.deleteComment(currentUser, 1, 1, 1),
      ).rejects.toThrow(
        new NotFoundException(`No such comment exists with id : 1`),
      );
    });

    it('Should throw UnauthorizedException', async () => {
      await postsService.createPost(currentUser, createPostDto);
      await commentService.createComment(currentUser, 1, 1, createCommentDto);

      await expect(
        commentService.deleteComment({ ...currentUser, id: 2 }, 1, 1, 1),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('Should delete comment', async () => {
      await postsService.createPost(currentUser, createPostDto);
      await commentService.createComment(currentUser, 1, 1, createCommentDto);
      const result = commentService.deleteComment(currentUser, 1, 1, 1);
      expect(result).toBeDefined();
    });
  });
});
