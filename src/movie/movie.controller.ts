import { Types } from 'mongoose';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './create-movie.dto';
import {
   Body,
   Controller,
   Delete,
   Get,
   HttpCode,
   Param,
   Post,
   Put,
   Query,
   UsePipes,
   ValidationPipe,
} from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { IsValidationPipe } from 'src/pipes/IdValidationPipe';

@Controller('movies')
export class MovieController {
   constructor(private readonly movieService: MovieService) {}

   @Get('most-popular')
   @HttpCode(200)
   async getMostPopular() {
      return this.movieService.getMostPopular();
   }

   @Put('update-count-opened')
   @HttpCode(200)
   async updateCount(@Body('slug') slug: string) {
      return this.movieService.updateCountOpened(slug);
   }

   @Get('by-slug/:slug')
   @HttpCode(200)
   async getBySlug(@Param('slug') slug: string) {
      return this.movieService.bySlug(slug);
   }

   @UsePipes(new ValidationPipe())
   @Post('by-genres')
   @HttpCode(200)
   async getByGenres(@Body('genreIds') genreIds: Types.ObjectId[]) {
      return this.movieService.byGenres(genreIds);
   }

   @Get('by-actor/:actorId')
   @HttpCode(200)
   async getByActor(
      @Param('actorId', IsValidationPipe) actorId: Types.ObjectId,
   ) {
      return this.movieService.byActor(actorId);
   }

   @Delete(':id')
   @HttpCode(200)
   @Auth('admin')
   async delete(@Param('id', IsValidationPipe) id: string) {
      return this.movieService.deleteMovie(id);
   }

   @Get(':id')
   @HttpCode(200)
   @Auth('admin')
   async getSingleMovie(@Param('id', IsValidationPipe) id: string) {
      return this.movieService.byId(id);
   }

   @UsePipes(new ValidationPipe())
   @Put(':id')
   @HttpCode(200)
   @Auth('admin')
   async update(
      @Param('id', IsValidationPipe) id: string,
      @Body() dto: CreateMovieDto,
   ) {
      return this.movieService.updateMovie(id, dto);
   }

   @Get()
   @HttpCode(200)
   async getAll(@Query('searchTerm') searchTerm: string) {
      return this.movieService.getAllMovies(searchTerm);
   }

   @UsePipes(new ValidationPipe())
   @Post()
   @HttpCode(200)
   @Auth('admin')
   async create() {
      return this.movieService.create();
   }
}
