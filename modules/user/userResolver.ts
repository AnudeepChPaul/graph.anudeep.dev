import { QueryUserDetailsArgs, User } from "../../generated/masterTypes";
import { getUserAddress, getUserDetailsByAll } from "./userDal";

export const userResolvers = {
  Query: {
    userDetails: (obj: any, args: QueryUserDetailsArgs, ctx: any) => {
      return getUserDetailsByAll(args.id)
    }
  },

  User: {
    address: (user: User) => {
      return getUserAddress(user.uniqueId)
    }
  }
}