import { MovieService } from './../movie/movie.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { GenreModel } from './genre.model';

@Injectable()
export class GenreService {
  constructor(
    @InjectModel(GenreModel) private readonly GenreModel: ModelType<GenreModel>,
    private readonly movieService: MovieService
  ){}

  async bySlug(slug: string){
    const withSlug = await this.GenreModel.find({ slug }).exec()

    if(!withSlug || withSlug.length == 0) throw new NotFoundException(`Genres, with slug ${slug} are not found`)

    return withSlug
  }

  async create(){
    const initialValues = {
      name: '',
      description: '',
      slug: 'sdf',
      icon: ''
    }

    const genre = await this.GenreModel.create(initialValues)
    return genre._id
  }

  async getAllGenres(searchTerm?: string){
    let options = {}

    if(searchTerm){
      options = {
        $or: [
          {
            name: new RegExp(searchTerm, 'i')
          },
          {
            slug: new RegExp(searchTerm, 'i')
          },
          {
            description: new RegExp(searchTerm, 'i')
          }
        ]
      }
    }

    return this.GenreModel
      .find(options)
      .select('-updatedAt -__v')
      .sort({createdAt: 'desc'})
      .exec()
  }

  async getCollections(){
    const genres = await this.getAllGenres()

    const collections = await Promise.all(
      genres.map(async genre => {
        const movieByGenres = await this.movieService.byGenres([genre._id])

        if(movieByGenres.length == 0) return null

        return {
          _id: String(genre._id),
          image: movieByGenres[0].bigPoster,
          title: genre.name,
          slug: genre.slug,
        }
    }))

    return collections.filter(el => el !== null)
  }

  // Admin only
  async byId(_id: string){
    const genre = this.GenreModel.findById(_id)
    if(!genre) throw new NotFoundException('Genre is not found')

    return genre
  }

  async updateGenre(_id: string, dto: CreateGenreDto){
    const genre = await this.GenreModel.findByIdAndUpdate(_id, dto, {
      new: true
    }).exec()

    if(!genre) throw new NotFoundException('Genre is not found')

    return genre
  }

  async deleteGenre(id: string){
    const genre =  this.GenreModel.findByIdAndDelete(id).exec()

    if(!genre) throw new NotFoundException('Genre is not found')
  }
}
