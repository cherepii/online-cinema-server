import { Injectable, NotFoundException, Type } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { Types} from "mongoose"
import { InjectModel } from 'nestjs-typegoose';
import { CreateMovieDto } from './create-movie.dto';
import { MovieModel } from './movie.model';

@Injectable()
export class MovieService {
  constructor(
    @InjectModel(MovieModel) private readonly MovieModel: ModelType<MovieModel>
  ){}

  async create(){
    const initialValues: CreateMovieDto = {
      title: '',
      slug: '',
      poster: '',
      bigPoster: '',
      videoUrl: '',
      genres: [],
      actors: [],
    }

    const movie = await this.MovieModel.create(initialValues)
    return movie._id
  }

  async getAllMovies(searchTerm?: string){
    let options = {}

    if(searchTerm){
      options = {
        $or: [
          {
            title: new RegExp(searchTerm, 'i')
          }
        ]
      }
    }

    return this.MovieModel
      .find(options)
      .populate('genres actors')
      .select('-updatedAt -__v')
      .sort({createdAt: 'desc'})
      .exec()
  }

  async updateCountOpened(slug: string){
    const movie = await this.MovieModel.findOneAndUpdate({slug}, {
      $inc: {countOpened: 1}
    }, {
      new: true
    }).exec()

    if(!movie) throw new NotFoundException('Movie is not found')

    return movie
  }

  async bySlug(slug: string){
    const withSlug = await this.MovieModel.find({ slug }).populate('genres actors').exec()

    if(!withSlug || withSlug.length == 0) throw new NotFoundException(`Movies, with slug ${slug} are not found`)

    return withSlug
  }

  async byActor(actorId: Types.ObjectId){
    const withSlug = await this.MovieModel.find({ actors: actorId }).exec()

    if(!withSlug || withSlug.length == 0) throw new NotFoundException(`Movies are not found`)

    return withSlug
  }

  async byGenres(genresId: Types.ObjectId[]){
    return this.MovieModel
      .find({ genres: {$in: genresId} })
      .exec()
  }

  async getMostPopular(){
    return this.MovieModel
      .find({countOpened: {$gt: 0}})
      .sort({countOpened: -1})
      .populate('genres')
      .exec()
  }

  async updateRating(id: Types.ObjectId, newRating: number){
    return this.MovieModel.findByIdAndUpdate(id, {
      rating: newRating
    })
  }

  // Admin only
  async byId(_id: string){
    const movie = this.MovieModel.findById(_id)
    if(!movie) throw new NotFoundException('movie is not found')

    return movie
  }

  async updateMovie(_id: string, dto: CreateMovieDto){
    const movie = await this.MovieModel.findByIdAndUpdate(_id, dto, {
      new: true
    }).exec()

    if(!movie) throw new NotFoundException('movie is not found')

    return movie
  }

  async deleteMovie(id: string){
    const movie =  this.MovieModel.findByIdAndDelete(id).exec()

    if(!movie) throw new NotFoundException('movie is not found')
  }
}
