import { AuthAction, CreateAction, body } from '@kittgen/nestjs-authorization';
import { Body, Controller, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { AppService } from './app.service';
import { IsAuthor } from './is-author.condition';
import { CreateHelloDto as UpdateArticleDto } from './update-article.dto';

export class ArticleAction {
    static Read = CreateAction('read-article');
    static Write = CreateAction('write-article');
    static Admin = CreateAction('all');
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Put('/articles')
  @AuthAction([
    ArticleAction.Admin.if(body(b => b.published)),
    ArticleAction.Write.if(IsAuthor)
  ])
  @UsePipes(new ValidationPipe())
  getHello(@Body() updateArtcileDto: UpdateArticleDto): string {
    return this.appService.getHello();
  }
}
