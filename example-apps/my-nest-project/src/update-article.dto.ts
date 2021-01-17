import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class UpdateArticleDto {
  @IsString()
  name: string;

  @IsBoolean()
  published: boolean;

  @IsNumber()
  authorId: number;
}
