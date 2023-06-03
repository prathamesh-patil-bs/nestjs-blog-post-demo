import { DataSource } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';

import { CommentRepository } from '@modules/comments/comments.repository';

describe('CommentRepository', () => {
  let repository: CommentRepository;
  const dataSource = {
    createEntityManager: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentRepository,
        {
          provide: DataSource,
          useValue: dataSource,
        },
      ],
    }).compile();

    repository = module.get<CommentRepository>(CommentRepository);
  });

  describe('Define', () => {
    it('Should define the CommentRepository', () => {
      expect(repository).toBeDefined();
    });
  });
});
