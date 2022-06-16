import { IsString, IsNumber, IsArray, IsBoolean, IsObject } from "class-validator";

export class Parameters {
  @IsNumber()
  year: number

  @IsNumber()
  duration: number

  @IsString()
  country: string
}

export class CreateMovieDto {
  @IsString()
  title: string
  
  @IsString()
  slug: string

  @IsString()
  poster: string

  @IsString()
  bigPoster: string

  @IsObject()
  parameters?: Parameters

  @IsString()
  videoUrl: string

  @IsArray()
  @IsString({each: true})
  genres: string[]

  @IsArray()
  @IsString({each: true})
  actors: string[]

  isSentTelegram?: boolean
}