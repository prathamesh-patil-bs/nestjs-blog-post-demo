import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PostDto {
  @Expose()
  @ApiProperty({ description: 'Id of the post.', example: 1 })
  id: number;

  @Expose()
  @ApiProperty({ description: 'Content of post.', example: 'Dummy post text.' })
  text: string;

  @Expose()
  @ApiProperty({ description: 'Title of post.', example: 'Dummy post title.' })
  title: string;

  @Expose()
  @ApiProperty({ description: 'Author Id of the post.', example: 2 })
  authorId: number;

  @Expose()
  @ApiProperty({ description: 'Creation date of post.' })
  createdAt: Date;

  @Expose()
  @ApiProperty({ description: 'Last modified date of post.' })
  updatedAt: Date;
}
