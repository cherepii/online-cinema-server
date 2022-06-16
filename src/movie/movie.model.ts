import { prop, Ref } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { ActorModel } from 'src/actor/actor.model';
import { GenreModel } from 'src/genre/genre.model';

export interface MovieModel extends Base {}

export class Parameters {
   @prop()
   year: number;

   @prop()
   duration: number;

   @prop()
   country: string;
}

export class MovieModel extends TimeStamps {
   @prop()
   title: string;

   @prop()
   slug: string;

   @prop()
   description: string;

   @prop()
   poster: string;

   @prop()
   bigPoster: string;

   @prop({ default: 3.0 })
   rating?: number;

   @prop({ default: 0 })
   countOpened?: number;

   @prop()
   parameters?: Parameters;

   @prop()
   videoUrl: string[];

   @prop({ ref: () => GenreModel })
   genres: Ref<GenreModel>[];

   @prop({ ref: () => ActorModel })
   actors: Ref<ActorModel>[];

   @prop({ default: false })
   isSentTelegram?: boolean;
}
