import {
  body,
  createAction,
  CheckPermission,
  PermissionInterceptor,
} from '@kittgen/nestjs-authorization';
import {
  Body,
  Controller,
  Get,
  Put,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { GetArticleDto } from './get-article.dto';
import { IsAuthor } from './is-author.condition';
import { UpdateArticleDto } from './update-article.dto';

export class ArticleAction {
  static Read = createAction('read-article');
  static Write = createAction('write-article');
  static Admin = createAction('all');
}

@Controller()
export class AppController {
  @Get('/articles')
  @CheckPermission(ArticleAction.Read)
  @UsePipes(new ValidationPipe())
  @UseInterceptors(PermissionInterceptor)
  getArticles(): GetArticleDto {
    return new GetArticleDto({
      authorId: 42,
      name: 'foo',
      published: false,
    });
  }

  @Put('/articles')
  @CheckPermission(
    ArticleAction.Admin.if(body((b) => b.published)),
    ArticleAction.Write.if(IsAuthor),
  )
  @UsePipes(new ValidationPipe())
  @UseInterceptors(PermissionInterceptor)
  updateArticle(@Body() updateArtcileDto: UpdateArticleDto): GetArticleDto {
    return new GetArticleDto(updateArtcileDto);
  }
}
