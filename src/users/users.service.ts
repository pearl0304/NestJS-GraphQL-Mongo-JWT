import { Injectable, Inject } from "@nestjs/common";
import { LoginInputType, User, UserInputType, UserUpdateType } from "../schemas/user.schema";
import { Model } from "mongoose";
import * as bcrypt from "bcrypt";
import { AuthService } from "../auth/auth.service";
import { ApolloError } from "apollo-server-express";
import * as moment from "moment-timezone";


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

        user.uid = user._id;
        user.access_token = access_token.access_token;
        return user;
      }
      return null;

    } catch (e) {
      throw new ApolloError(e);
    }
  }

  async updateUser(user: User, uid: string, input: UserUpdateType) {
    try {
      if (user.uid !== uid) throw new ApolloError("You don't have to access.");
      const check_user = await this.userModel.findById({ _id: uid }).exec();
      if (!check_user) throw new ApolloError("There are no user information.");

      const data = {
        ...input,
        date_updated: moment().local().format()
      };

      await this.userModel.findOneAndUpdate(
        { _id: uid }, { ...data }, { new: true }
      );

      const result = {
        uid: uid,
        email: check_user.email,
        displayName: input.displayName ? input.displayName : check_user.displayName,
        ...data
      };
      return result;
    } catch (e) {
      throw new ApolloError(e);
    }
  }
}
