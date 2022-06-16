import { Types } from 'mongoose';

export interface ICollection {
  image: string
  title: string
  slug: string
  _id: Types.ObjectId | string
}