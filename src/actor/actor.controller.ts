import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { IsValidationPipe } from 'src/pipes/IdValidationPipe';
import { ActorDto } from './actor.dto';
import { ActorService } from './actor.service';

@Controller('actors')
export class ActorController {
  constructor(private readonly actorService: ActorService){}
  
  @Get()
  @HttpCode(200)
  async getAllActors(@Query('searchTerm') searchTerm: string){
    return this.actorService.getAll(searchTerm)
  }

  @UsePipes(new ValidationPipe)
  @Post()
  @Auth('admin')
  @HttpCode(200)
  async createActor(){
    return this.actorService.create()
  }

  @Get(':id')
  @HttpCode(200)
  @Auth('admin')
  async byId(@Param('id', IsValidationPipe) id: string){
    return this.actorService.byId(id)
  }

  @UsePipes(new ValidationPipe)
  @Put(':id')
  @Auth('admin')
  @HttpCode(200)
  async updateActor(
    @Param('id') id: string,
    @Body() dto: ActorDto){
      return this.actorService.update(id, dto)
    }

  @Delete(':id')
  @HttpCode(200)
  @Auth('admin')
  async deleteActor(@Param('id') id: string){
    return this.actorService.delete(id)
  }

  @Get('by-slug/:slug')
  @HttpCode(200)
  async getBySlug(@Param('slug') slug: string){
    return this.actorService.bySlug(slug)
  }
}
