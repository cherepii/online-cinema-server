import { Injectable, NotFoundException, Param } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { ActorDto } from './actor.dto';
import { ActorModel } from './actor.model';

@Injectable()
export class ActorService {
  constructor(@InjectModel(ActorModel) private readonly ActorModel: ModelType<ActorModel>){}

  async bySlug(slug: string){
    const withSlug = await this.ActorModel.find({slug}).exec()

    if(!withSlug || withSlug.length == 0) throw new NotFoundException('Actor is not found')

    return withSlug
  }

  async getAll(searchTerm: string){
    let options = {}

    if(searchTerm){
      options = {
        $or: [
          {
            name: RegExp(searchTerm, 'i')
          },
          {
            slug: RegExp(searchTerm, 'i')
          }
        ]
      }
    }

    const actors = await this.ActorModel
      .aggregate().match(options).lookup({
        from: 'Movie',
        foreignField: 'actors',
        localField: '_id',
        as: 'movies'
      }).addFields({
        countMovies: {
          $size: '$movies'
        }
      })
      .project({__v: 0, createdAt: 0, movies: 0})
      .sort({createdAt: -1})
      .exec()

    if(!actors || actors.length == 0) throw new NotFoundException('Actors are not found')

    return actors
  }

  //admin only
  async create(){
    const defaultValues = {
      name: '',
      slug: '',
      avatar: ''
    }
    const actor = await this.ActorModel.create(defaultValues)

    return actor._id
  }

  async byId(_id: string){
    const actor = await this.ActorModel.findById(_id).exec()

    if(!actor) throw new NotFoundException('Actor is not found')
    return actor
  }

  async update(_id: string, dto: ActorDto){
    const actor = await this.ActorModel.findByIdAndUpdate(_id, dto, {
      new: true
    })

    if(!actor) throw new NotFoundException('Actor is not found')
    return actor
  }

  async delete(_id: string){
    const actor = await this.ActorModel.findByIdAndDelete(_id)

    if(!actor) throw new NotFoundException('Actor is not found')
  }


}
