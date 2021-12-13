import { QueryResolvers, QueryUserDetailsArgs, User, UserResolvers } from "@gen/masterTypes";
import { getUserAddress, getUserDetailsByAll } from "./userDal";

export const userResolvers = {
  Query: {
    userDetails: (_obj: any, args: QueryUserDetailsArgs) => {
      return getUserDetailsByAll(args.id)
    }
  } as QueryResolvers,

  User: {
    address: (user: User) => {
      return getUserAddress(user.uniqueId)
    }
  } as UserResolvers
}