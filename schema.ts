import { mergeSchemas } from "@graphql-tools/schema";
import { mergeTypeDefs, mergeResolvers } from "@graphql-tools/merge";
import { loadFilesSync } from "@graphql-tools/load-files";
import { userResolvers } from "./modules/user/userResolver";
import path from "path";
import { resumeResolver } from "./modules/resume/resumeResolver";

export const typeDefs = mergeTypeDefs(
  loadFilesSync(path.join(__dirname, "modules/**/typedef/*.graphql"))
)

export const resolvers = mergeResolvers([
  userResolvers, resumeResolver
])