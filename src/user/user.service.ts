import { genSalt, hash } from 'bcryptjs';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { Types } from "mongoose"
import { InjectModel } from 'nestjs-typegoose';
import { updateProfileDto } from './dto/update-profile.dto';
import { UserModel } from './user.model';

@Injectable()
export class UserService {
  constructor(@InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>){}

  async byId(_id: string){
    const user = this.UserModel.findById(_id).select('-password')
    if(!user) throw new BadRequestException('User not found')

    return user
  }

  async updateProfile(_id: string, dto: updateProfileDto){
    const user = await this.byId(_id)
    const isSameUser = this.UserModel.findOne({email: dto.email})

    if(isSameUser && _id == isSameUser._id)
      throw new NotFoundException('Email busy')

    if(dto.password){
      const salt = await genSalt(10)
      user.password = await hash(dto.password, salt)
    }

    user.email = dto.email
    if(dto.isAdmin || dto.isAdmin === false)
      user.isAdmin = dto.isAdmin

    await user.save()
  }

  async getCount(){
    return this.UserModel.find().count().exec()
  }

  async getAllUsers(searchTerm?: string){
    let options = {};

    if(searchTerm)
      options = {
        $or: [
          {
            email: new RegExp(searchTerm, 'i')
          } 
        ]
      }

      return this.UserModel.find(options).select('-password -updatedAt -__v').sort({
        createdAt: 'desc'
      }).exec()
  }

  async deleteUser(_id: string){
    return this.UserModel.findByIdAndDelete(_id)
  }

  async toggleFavorites(user: UserModel, movieId: Types.ObjectId){
    const {favorites, _id} = user

    await this.UserModel.findByIdAndUpdate(_id, {
      favorites: favorites.includes(movieId)
      ? favorites.filter(id => String(movieId) !== String(id))
      : [...favorites, movieId]
    })
  }

  async getFavoriteMovies(_id: Types.ObjectId){
    return this.UserModel
      .findById(_id, 'favorites')
      .populate({
        path: 'favorites',
        populate: {
          path: 'genres'
        }
      })
      .exec()
      .then(data => data.favorites)
  }
}
