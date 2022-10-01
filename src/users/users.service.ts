import { Injectable, Inject } from "@nestjs/common";
import { LoginInputType, User, UserInputType } from "../schemas/user.schema";
import { Model } from "mongoose";
import * as bcrypt from "bcrypt";
import { AuthService } from "../auth/auth.service";
import { ApolloError } from "apollo-server-express";


@Injectable()
export class UsersService {
  constructor(
    @Inject("USER_MODEL")
    private readonly userModel: Model<User>,
    private readonly authService: AuthService
  ) {
  }

  async findAll(): Promise<User[]> {
    try {
      return this.userModel.find().exec();
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    try {
      return this.userModel.findOne({ email: email });
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  async createUser(user: UserInputType) {
    try {
      // CREATE DATA
      const saltRounds = 10;
      const data = {
        ...user,
        password: await bcrypt.hash(user.password, saltRounds),
        date_crated: new Date()
      };

      const result = await this.userModel.create(data);
      return {
        uid: result._id,
        ...data
      };

    } catch (e) {
      throw new ApolloError(e);
    }
  }

  async login(input: LoginInputType) {
    try {
      const user = await this.authService.validateUser(input.email, input.password);
      if (!user) {
        throw new ApolloError("Email or password are invalid");
      } else {
        const access_token = await this.authService.generateUserCredentials(user);
        console.log("access_token", access_token);

        user.uid = user._id;
        user.access_token = access_token.access_token;

        console.log(user);
        return user;
      }
      return null;

    } catch (e) {
      throw new ApolloError(e);
    }
  }
}
