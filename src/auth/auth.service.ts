import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import  { ModelType } from "@typegoose/typegoose/lib/types"
import { InjectModel } from 'nestjs-typegoose';
import { genSalt, hash, compare } from 'bcryptjs';

import { UserModel } from 'src/user/user.model';
import { AuthDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenDto } from './dto/refreshToken.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>,
    private readonly jwtService: JwtService
  ){}

  //login
  async login(dto: AuthDto){
    const user = await this.validateUser(dto)

    const tokens = await this.genTokens(String(user._id))

    return {
      user: this.returnUserFields(user),
      ...tokens
    }
  }

  //find user by refresh token 
  async getNewTokens({refresh}: RefreshTokenDto){
    if(!refresh) throw new UnauthorizedException('Please, sign in')

    const result = await this.jwtService.verifyAsync(refresh)

    if(!result) throw new UnauthorizedException('Token is invalid or expired')

    const user = await this.UserModel.findById(result._id)

    const tokens = await this.genTokens(String(user._id))

    return {
      user: this.returnUserFields(user),
      tokens
    }
  }

  //registration
  async register(dto: AuthDto){
    const hasUser = await this.UserModel.findOne({email: dto.email})
    if(hasUser){
      throw new BadRequestException('This user is already logged')
    }

    const salt = await genSalt(10)
    
    const newUser = new this.UserModel({
      email: dto.email,
      password: await hash(dto.password, salt)
    })

    const user = await newUser.save()

    const tokens = await this.genTokens(String(user._id))

    return {
      user: this.returnUserFields(user),
      ...tokens
    }
  }

  async validateUser(dto: AuthDto): Promise<UserModel> {
    const user = await this.UserModel.findOne({email: dto.email})
    if(!user){
      throw new UnauthorizedException('User not found')
    }

    const isValidPassword = await compare(dto.password, user.password)
    if(!isValidPassword){
      throw new UnauthorizedException('Password is uncorrectable')
    }

    return user
  }

  async genTokens(userId: string){
    const data = {_id: userId}

    const refresh = await this.jwtService.signAsync(data, {
      expiresIn: '15d'
    })

    const access = await this.jwtService.signAsync(data, {
      expiresIn: '30m'
    })

    return {
      refresh,
      access
    }
  }

  returnUserFields(user: UserModel){
    return {
      _id: user._id,
      email: user.email,
      isAdmin: user.isAdmin
    }
  }
}
