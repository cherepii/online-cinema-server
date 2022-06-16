import { Body, Controller, Delete, Get, HttpCode, Param, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { IsValidationPipe } from 'src/pipes/IdValidationPipe';
import { User } from './decorators/user.decorator';
import { updateProfileDto } from './dto/update-profile.dto';
import { UserService } from './user.service';
import {Types} from "mongoose"
import { UserModel } from './user.model';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService){}

  @Get('profile')
  @HttpCode(200)
  @Auth()
  async getProfile(@User('_id') _id: string){
    return this.userService.byId(_id)
  }

  @UsePipes(new ValidationPipe())
  @Put('profile')
  @HttpCode(200)
  @Auth()
  async updateProfile(@User('_id') _id: string, @Body() dto: updateProfileDto){
    return this.userService.updateProfile(_id, dto)
  }

  @Get('profile/favorites')
  @HttpCode(200)
  @Auth()
  async getFavorites(@User('_id') _id: Types.ObjectId){
    return this.userService.getFavoriteMovies(_id)
  }

  @Put('profile/favorites')
  @HttpCode(200)
  @Auth()
  async toggleFavorites(
    @User() user: UserModel,
    @Body('movieId', IsValidationPipe) movieId: Types.ObjectId){
    return this.userService.toggleFavorites(user, movieId)
  }

  @Get('count')
  @HttpCode(200)
  @Auth('admin')
  async getCountUsers(@User('_id') _id: string){
    return this.userService.getCount()
  }

  @Get()
  @HttpCode(200)
  @Auth('admin')
  async getUsers(@Query('searchTerm') searchTerm?: string){
    return this.userService.getAllUsers(searchTerm)
  }

  @Get(':id')
  @HttpCode(200)
  @Auth('admin')
  async getUser(@Param('id', IsValidationPipe) id: string){
    return this.userService.byId(id)
  }

  @UsePipes(new ValidationPipe())
  @Put(':id')
  @HttpCode(200)
  @Auth('admin')
  async updateUser(
    @Param('id', IsValidationPipe) id: string, 
    @Body() dto: updateProfileDto){
      return this.userService.updateProfile(id, dto)
  }

  @Delete(':id')
  @HttpCode(200)
  @Auth('admin')
  async deleteUser(@Param('id', IsValidationPipe) id: string){
      return this.userService.deleteUser(id)
  }
}
