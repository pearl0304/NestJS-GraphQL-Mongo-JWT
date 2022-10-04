import { UseGuards } from "@nestjs/common";
import { Query, Resolver, Args, Mutation, ID } from "@nestjs/graphql";
import { LoginInputType, User, UserInputType, UserUpdateType } from "../schemas/user.schema";
import { UsersService } from "./users.service";
import { ApolloError } from "apollo-server-express";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CurrentUser } from "../user.decorator";

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

  @UseGuards(JwtAuthGuard)
  @Mutation(() => User)
  async updateUser(
    @CurrentUser() user: User,
    @Args("uid", { type: () => ID }) uid: string,
    @Args("input") input: UserUpdateType) {
    try {
      return await this.usersService.updateUser(user, uid, input);
    } catch (e) {
      throw new ApolloError(e);
    }
  }
}