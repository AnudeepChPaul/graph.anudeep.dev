import { Company, IntroductionInput } from "../../generated/masterTypes"
import { getAllCompanies, getAllSkills, getIntro, getProjectsByCompany, getTop10Skills } from "./resumeDal"

export const resumeResolver = {
  Query: {
    userIntroduction: (obj: any, args: any, ctx: any) => {
      return getIntro()
    },
    top10: (obj: any, args: any, ctx: any) => {
      return getTop10Skills()
    },
    allSkills: (obj: any, args: any, ctx: any) => {
      return getAllSkills()
    },
    allCompanies: (obj: any, args: any, ctx: any) => {
      return getAllCompanies()
    },
  },

  Company: {
    projects: (company: Company) => {
      return getProjectsByCompany(company.uniqueId)
    }
  },

  Mutation: {
    saveUserIntroduction: (obj: any, args: IntroductionInput, ctx: any) => { },
    saveSkill: (obj: any, args: IntroductionInput, ctx: any) => { },
    saveCompany: (obj: any, args: IntroductionInput, ctx: any) => { },
    saveCompanyProject: (obj: any, args: IntroductionInput, ctx: any) => { }
  }
}