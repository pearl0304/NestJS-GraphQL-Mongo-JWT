import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { UsersModule } from "./users/users.module";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ".env",
      isGlobal: true
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: "schema.gql",
      context: ({ req, connection }) => {
        if (req) {
          const user = req.headers.authorization;
          console.log("context", user);
          return { ...req, user };
        } else {
          return connection;
        }
      }
    }),
    UsersModule,
    AuthModule],
  controllers: [],
  providers: []
})
export class AppModule {
}
