import { IsEmail } from "class-validator"

export class updateProfileDto {
  @IsEmail()
  email: string

  password?: string
  isAdmin?: boolean
} 