import {
  UserCompanyDataSource,
  UserIntroductionDataSource,
  UserProjectsDataSource,
  UserSkillsDataSource
} from '@/modules/resume/resumeDal'
import { MongoClient } from 'mongodb'
import { Collection } from 'apollo-datasource-mongodb'
import { CompanyDbObject, IntroductionDbObject, ProjectDbObject, SkillDbObject } from '@gen/masterTypes'

export type Context = {
  userToken: string
  dataSources: Datasource
}

export type Datasource = {
  userIntroApi: UserIntroductionDataSource
  userSkillsApi: UserSkillsDataSource
  userCompanyApi: UserCompanyDataSource
  userProjectsApi: UserProjectsDataSource
}

export const dataSources = (client: MongoClient) => (): Datasource => ({
  userIntroApi: new UserIntroductionDataSource( client.db().collection( 'userIntro' ) as Collection<IntroductionDbObject> )  
  , userSkillsApi: new UserSkillsDataSource( client.db().collection( 'userSkills' ) as Collection<SkillDbObject> )  
  , userCompanyApi: new UserCompanyDataSource( client.db().collection( 'userCompanies' ) as Collection<CompanyDbObject> )  
  , userProjectsApi: new UserProjectsDataSource( client.db().collection( 'userCompanies' ) as Collection<ProjectDbObject> )
})