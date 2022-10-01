import { Field, ID, ObjectType, ArgsType, InputType } from "@nestjs/graphql";
import * as mongoose from "mongoose";
import { Document } from "mongoose";


export const UserSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  displayName: String,
  email: String,
  photoURL: String,
  password: String,
  intro: String,
  date_crated: String
});

@ObjectType()
export class User extends Document {
  @Field(() => ID)
  uid: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  displayName: string;

  @Field(() => String, { nullable: true })
  photoURL: string;

  @Field(() => String, { nullable: true })
  intro: string;

  @Field(() => String, { nullable: true })
  date_crated: string;

  @Field(() => String, { nullable: true })
  access_token: string;

  password: string;
}

@ArgsType()
@InputType()
export class UserInputType {
  @Field()
  email: string;

  @Field()
  displayName: string;

  @Field({ nullable: true })
  photoURL: string;

  @Field({ nullable: true })
  intro: string;

  @Field()
  password: string;
}

@ArgsType()
@InputType()
export class LoginInputType {
  @Field()
  email: string;

  @Field()
  password: string;
}