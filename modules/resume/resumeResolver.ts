import {
  Company,
  CompanyDbObject,
  Introduction,
  IntroductionDbObject,
  MutationResolvers,
  MutationSaveCompanyArgs,
  MutationSaveCompanyProjectArgs,
  MutationSaveSkillArgs,
  MutationSaveUserIntroductionArgs,
  Project,
  ProjectDbObject,
  QueryProjectsByCompanyIdArgs,
  QueryResolvers,
  Skill,
  SkillCategory,
  SkillDbObject
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
      return top10.map( skill => ({
        ...skill,
        _id: skill._id.toString(),
        category: skill.category as SkillCategory[]
      }) )
    },
    allSkills: async (obj: any, args: any, { dataSources }: Context)
      : Promise<Array<Skill>> => {
      const allSkills = await dataSources.userSkillsApi.getAllSkills()
      return allSkills.map(
        (skill: SkillDbObject) => ({ ...skill, _id: skill._id.toString() } as Skill) )
    },
    allCompanies: async (obj: any, args: any, { dataSources }: Context)
      : Promise<Array<Company>> => {
      const allCompanies = await dataSources.userCompanyApi.getAllCompanies()
      return allCompanies.map(
        (cmp: CompanyDbObject) => ({ ...cmp, _id: cmp._id.toString() } as Company)
      )
    },
    projectsByCompanyId: async (parent: any, { companyId }: QueryProjectsByCompanyIdArgs, { dataSources }: Context): Promise<Array<Project>> => {
      const res = await dataSources.userProjectsApi.getProjectsByCompany( companyId )
      const mappedRes = res.map(
        (res: ProjectDbObject) => ({ ...res, companyId: res._id.toString() }) );
      return mappedRes;
    }
  } as QueryResolvers,

  Mutation: {
    saveUserIntroduction: async (parent: unknown, { data }: MutationSaveUserIntroductionArgs, { dataSources }: Context)
      : Promise<Array<Introduction>> => {
      if ( data._id ) {
        return (await dataSources.userIntroApi.updateUserIntro( data )).map(
          (intro: IntroductionDbObject) => ({
            ...intro,
            _id: intro._id.toString()
          })
        ) as Array<Introduction>;
      }
      const res = await dataSources.userIntroApi.createUserIntro( data );
      return res.map(
        (intro: IntroductionDbObject) => ({
          ...intro,
          _id: intro._id.toString()
        })
      ) as Array<Introduction>;
    },

    saveSkill: async (parent: unknown, { skill }: MutationSaveSkillArgs, { dataSources }: Context, info: GraphQLResolveInfo)
      : Promise<Array<Skill>> => {
      if ( !skill._id ) {
        return (await dataSources.userSkillsApi.createSkill( skill )).map(
          (skill: SkillDbObject) => ({
            ...skill,
            _id: skill._id.toString()
          })
        ) as Array<Skill>;
      }
      return (await dataSources.userSkillsApi.updateSkill( skill )).map(
        (skill: SkillDbObject) => ({
          ...skill,
          _id: skill._id.toString()
        })
      ) as Array<Skill>;
    },

    saveCompany: async (parent: unknown, { company }: MutationSaveCompanyArgs, { dataSources }: Context, info: GraphQLResolveInfo)
      : Promise<Array<Company>> => {
      if ( !company._id ) {
        return (await dataSources.userCompanyApi.createCompany( company )).map(
          (company: CompanyDbObject) => ({
            ...company,
            _id: company._id.toString()
          })
        ) as Array<Company>;
      }
      return (await dataSources.userCompanyApi.updateCompany( company )).map(
        (company: CompanyDbObject) => ({
          ...company,
          _id: company._id.toString()
        })
      ) as Array<Company>
    },

    saveCompanyProject: async (parent: unknown, { projectInput }: MutationSaveCompanyProjectArgs,
                               { dataSources }: Context, info: GraphQLResolveInfo): Promise<Array<Project>> => {
      const projects = await dataSources.userProjectsApi.createProject( projectInput.companyId, projectInput )
      return projects.map(
        (projects: ProjectDbObject) => ({
          ...projects,
          _id: projects._id.toString(),
          companyId: projectInput.companyId
        })
      ) as Array<Project>;
    }
  } as MutationResolvers<Context>
}
