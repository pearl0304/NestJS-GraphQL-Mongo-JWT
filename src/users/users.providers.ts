import { Connection } from "mongoose";
import { UserSchema } from "../schemas/user.schema";

export const UsersProviders: any = [
  {
    provide: "USER_MODEL",
    useFactory: (connection: Connection) => connection.model("User", UserSchema,'users'),
    inject: ["DATABASE_CONNECTION"]
  }
];