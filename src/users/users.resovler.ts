import { Query, Resolver, Args, Mutation } from "@nestjs/graphql";
import { LoginInputType, User, UserInputType } from "../schemas/user.schema";
import { UsersService } from "./users.service";
import { ApolloError } from "apollo-server-express";


@Resolver()
export class UsersResolver {
  constructor(private usersService: UsersService) {
  }

  @Query(() => [User])
  async findAll() {
    try {
      return await this.usersService.findAll();
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  @Mutation(() => User)
  async createUser(@Args("input") user: UserInputType) {
    try {
      return await this.usersService.createUser(user);
    } catch (e) {
      throw new ApolloError(e);
    }
  }

  @Mutation(() => User)
  async login(@Args("input") input: LoginInputType) {
    try {
      return await this.usersService.login(input);
    } catch (e) {
      throw new ApolloError(e);
    }

  }
}