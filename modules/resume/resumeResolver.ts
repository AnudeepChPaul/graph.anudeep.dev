import {
  Company,
  Introduction,
  MutationResolvers,
  MutationSaveCompanyArgs,
  MutationSaveCompanyProjectArgs,
  MutationSaveSkillArgs,
  MutationSaveUserIntroductionArgs,
  Project,
  QueryProjectsByCompanyIdArgs,
  QueryResolvers,
  Skill,
  Success
} from "@gen/masterTypes"
import { Context } from "dataSources"
import { GraphQLResolveInfo } from 'graphql'

export const resumeResolver = {
  Query: {
    userIntroduction: async (obj: any, args: any, { dataSources }: Context)
      : Promise<Introduction[]> => {
      const intro = await dataSources.userIntroApi.getIntro()
      return intro.map( i => ({ ...i, _id: i._id.toString() }) );
    },
    top10: async (obj: any, args: any, { dataSources }: Context)
      : Promise<Array<Skill>> => {
      const top10 = await dataSources.userSkillsApi.getTop10Skills()
      return top10
    },
    allSkills: async (obj: any, args: any, { dataSources }: Context)
      : Promise<Array<Skill>> => {
      const allSkills = await dataSources.userSkillsApi.getAllSkills()
      return allSkills
    },
    allCompanies: async (obj: any, args: any, { dataSources }: Context)
      : Promise<Array<Company>> => {
      const allCompanies = await dataSources.userCompanyApi.getAllCompanies()
      return allCompanies
    },
    projectsByCompanyId: async (parent: any, { companyId }: QueryProjectsByCompanyIdArgs, { dataSources }: Context): Promise<Array<Project>> => {
      const res = await dataSources.userProjectsApi.getProjectsByCompany( companyId )
      return res;
    }
  } as QueryResolvers,

  Mutation: {
    saveUserIntroduction: async (parent: unknown, { data }: MutationSaveUserIntroductionArgs, { dataSources }: Context)
      : Promise<Array<Introduction>> => {
      if ( data._id ) {
        return (await dataSources.userIntroApi.updateUserIntro( data ))
      }
      const res = await dataSources.userIntroApi.createUserIntro( data );
      return res
    },

    saveSkill: async (parent: unknown, { skill }: MutationSaveSkillArgs, { dataSources }: Context, info: GraphQLResolveInfo)
      : Promise<Array<Skill>> => {
      if ( !skill._id ) {
        return (await dataSources.userSkillsApi.createSkill( skill ))
      }
      return (await dataSources.userSkillsApi.updateSkill( skill ))
    },

    saveCompany: async (parent: unknown, { company }: MutationSaveCompanyArgs, { dataSources }: Context, info: GraphQLResolveInfo)
      : Promise<Array<Company>> => {
      if ( !company._id ) {
        return (await dataSources.userCompanyApi.createCompany( company ))
      }
      return (await dataSources.userCompanyApi.updateCompany( company ))
    },

    saveCompanyProject: async (parent: unknown, { projectInput }: MutationSaveCompanyProjectArgs,
                               { dataSources }: Context, info: GraphQLResolveInfo): Promise<Array<Project>> => {
      const projects = await dataSources.userProjectsApi.createProject( projectInput.companyId, projectInput )
      return projects
    },

    removeSkill: async (parent, { skillId }, { dataSources }): Promise<Success> => {
      return await dataSources.userSkillsApi.removeSkill( skillId )
    },

    removeCompany: async (parent, { companyId }, { dataSources }) => {
      return await dataSources.userCompanyApi.removeCompany( companyId )
    },

    removeProject: async (parent, { companyId, nameOfProject }, { dataSources }) => {
      return await dataSources.userProjectsApi.removeProject( companyId, nameOfProject );
    }
  } as MutationResolvers<Context>
}
