import { CreateGenreDto } from './dto/create-genre.dto';
import { GenreService } from './genre.service';
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { IsValidationPipe } from 'src/pipes/IdValidationPipe';

@Controller('genres')
export class GenreController {
  constructor(private readonly genreService: GenreService){}

  @Get()
  @HttpCode(200)
  async getAll(@Query('searchTerm') searchTerm: string){
    return this.genreService.getAllGenres(searchTerm)
  }

  @UsePipes(new ValidationPipe)
  @Post()
  @HttpCode(200)
  @Auth('admin')
  async create(){
    return this.genreService.create()
  }

  @Get('by-slug/:slug')
  @HttpCode(200)
  async getBySlug(@Param('slug') slug: string){
    return this.genreService.bySlug(slug)
  }

  @Get('collections')
  @HttpCode(200)
  async getCollections(){
    return this.genreService.getCollections()
  }

  @Get(':id')
  @HttpCode(200)
  @Auth('admin')
  async getSingleGenre(@Param('id', IsValidationPipe) id: string){
    return this.genreService.byId(id)
  }

  @UsePipes(new ValidationPipe())
  @Put(':id')
  @HttpCode(200)
  @Auth('admin')
  async update(
    @Param('id', IsValidationPipe) id: string, 
    @Body() dto: CreateGenreDto){
    return this.genreService.updateGenre(id, dto)
  }

  @Delete(':id')
  @HttpCode(200)
  @Auth('admin')
  async delete(@Param('id', IsValidationPipe) id: string){
    return this.genreService.deleteGenre(id)
  }
}
