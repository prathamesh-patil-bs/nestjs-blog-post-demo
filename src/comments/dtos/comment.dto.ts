import { ApiProperty } from '@nestjs/swagger';

export class CommentDto {
  @ApiProperty({ description: 'Id of the comment.', example: 1 })
  id: number;

  @ApiProperty({
    description: 'Content of the comment',
    example: 'Dummy Comment',
  })
  text: string;

  @ApiProperty({
    description: 'Id of the post on which comment is made.',
    example: 2,
  })
  postId: number;

  @ApiProperty({
    description: 'Id of the user who created the comment.',
    example: 2,
  })
  userId: number;

  @ApiProperty({
    description: 'Creation date of comment.',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last updated date of comment.',
  })
  updatedAt: Date;
}
