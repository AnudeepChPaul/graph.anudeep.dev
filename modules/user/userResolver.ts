import { QueryResolvers, QueryUserDetailsArgs, Resolvers, User, UserResolvers } from "@gen/masterTypes";
import { getUserAddress, getUserDetailsByAll } from "./userDal";

export const userResolvers = {
  Query: {
    userDetails: (obj: any, args: QueryUserDetailsArgs, ctx: any) => {
      return getUserDetailsByAll(args.id)
    }
  } as QueryResolvers,

  User: {
    address: (user: User) => {
      return getUserAddress(user.uniqueId)
    }
  } as UserResolvers
}