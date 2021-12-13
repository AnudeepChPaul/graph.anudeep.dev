import { mergeResolvers } from '@graphql-tools/merge'
import { userResolvers } from '@/modules/user/userResolver'
import { resumeResolver } from '@/modules/resume/resumeResolver'
import { DIRECTIVES } from '@graphql-codegen/typescript-mongodb'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { GraphQLSchema } from 'graphql'
import { authResolver } from '@/modules/auth/authResolver'
import authTypeDefs from '@/modules/auth/Auth.graphql'
import resumeTypeDefs from '@/modules/resume/Resume.graphql'
import userTypeDefs from '@/modules/user/User.graphql'
/*
export const typeDefs = mergeTypeDefs(
  loadFilesSync(path.join(__dirname, "modules/!**!/!*.graphql")),
  // [ authTypeDefs, resumeTypeDefs, userTypeDefs ]
)
*/

export const resolvers = mergeResolvers( [
  userResolvers
  , resumeResolver
  , authResolver
] )

export const schema: GraphQLSchema = makeExecutableSchema( {
  typeDefs: [
    DIRECTIVES
    , authTypeDefs
    , resumeTypeDefs
    , userTypeDefs
  ]
  , resolvers
} )