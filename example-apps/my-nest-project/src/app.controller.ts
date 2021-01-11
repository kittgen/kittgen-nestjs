import { CheckPermission, CreateAction, body } from '@kittgen/nestjs-authorization';
import {
  Body,
  Controller,
  Get,
  Put,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ExposeIfHasPermissionForInterceptor } from './expose-if-has-permission-for.interceptor';
import { GetArticleDto } from './get-article.dto';
import { IsAuthor } from './is-author.condition';
import { CreateHelloDto as UpdateArticleDto } from './update-article.dto';

export class ArticleAction {
  static Read = CreateAction('read-article');
  static Write = CreateAction('write-article');
  static Admin = CreateAction('all');
}

@Controller()
export class AppController {
  @Get('/articles')
  @AuthAction([ArticleAction.Read])
  @UsePipes(new ValidationPipe())
  @UseInterceptors(ExposeIfHasPermissionForInterceptor)
  getArticles(): GetArticleDto {
    return new GetArticleDto({
      authorId: 42,
      name: 'foo',
      published: false,
    });
  }

  @Put('/articles')
  @CheckPermission([
    ArticleAction.Admin.if(body((b) => b.published)),
    ArticleAction.Write.if(IsAuthor),
  ])
  @UsePipes(new ValidationPipe())
  @UseInterceptors(ExposeIfHasPermissionForInterceptor)
  updateArticle(@Body() updateArtcileDto: UpdateArticleDto): GetArticleDto {
    return new GetArticleDto(updateArtcileDto);
  }
}
