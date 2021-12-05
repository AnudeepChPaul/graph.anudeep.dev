import { mergeTypeDefs, mergeResolvers } from "@graphql-tools/merge";
import { loadFilesSync } from "@graphql-tools/load-files";
import { userResolvers } from "@mods/user/userResolver";
import path from "path";
import { resumeResolver } from "@mods/resume/resumeResolver";
import { DIRECTIVES } from '@graphql-codegen/typescript-mongodb'
import { makeExecutableSchema } from "@graphql-tools/schema";
import { GraphQLSchema } from "graphql";

export const typeDefs = mergeTypeDefs(
  loadFilesSync(path.join(__dirname, "modules/**/typedef/*.graphql"))
)

export const resolvers = mergeResolvers([
  userResolvers, resumeResolver
])

export const schema: GraphQLSchema = makeExecutableSchema({
  typeDefs: [
    DIRECTIVES,
    typeDefs
  ],
  resolvers
})