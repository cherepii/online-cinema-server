import { Types } from 'mongoose';
import { IsValidationPipe } from 'src/pipes/IdValidationPipe';
import { Body, Controller, Get, HttpCode, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { RatingService } from './rating.service';
import { User } from 'src/user/decorators/user.decorator';
import { SetRatingDto } from './set-rating.dto';

@Controller('ratings')
export class RatingController {
  constructor(
    private readonly ratingService: RatingService
  ){}

  @Get(':movieId')
  @HttpCode(200)
  @Auth()
  async getMovieRatingByUser(
    @Param('movieId', IsValidationPipe) movieId: Types.ObjectId,
    @User('_id') _id: Types.ObjectId
  ){
    return this.ratingService.getMovieRatingByUser(movieId, _id)
  }

  @UsePipes(new ValidationPipe())
  @Post('set-rating')
  @HttpCode(200)
  @Auth()
  async setRating(
    @User('_id') _id: Types.ObjectId,
    @Body() dto: SetRatingDto
  ){
    return this.ratingService.setRating(_id, dto)
  }
}
