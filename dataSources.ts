import {
  UserCompanyDataSource,
  UserIntroductionDataSource,
  UserProjectsDataSource,
  UserSkillsDataSource
} from "@mods/resume/resumeDal";
import { Document, MongoClient } from 'mongodb'
import { Collection } from 'apollo-datasource-mongodb'
import { CompanyDbObject, IntroductionDbObject, ProjectDbObject, SkillDbObject } from '@gen/masterTypes'

export const connectMongo = async () => {
  const newClient = new MongoClient( `${process.env['MONGO_URL']}` )
  await newClient.connect()
  return newClient
}

export type Context = {
  userToken: string
  dataSources: Datasources
}

export interface Datasources {
  userIntroApi: UserIntroductionDataSource
  userSkillsApi: UserSkillsDataSource
  userCompanyApi: UserCompanyDataSource
  userProjectsApi: UserProjectsDataSource
}

export const dataSources = (client: MongoClient) => (): Datasources => ({
  userIntroApi: new UserIntroductionDataSource( client.db().collection( 'userIntro' ) as unknown as Collection<IntroductionDbObject> ),
  userSkillsApi: new UserSkillsDataSource( client.db().collection( 'userSkills' ) as unknown as Collection<SkillDbObject>),
  userCompanyApi: new UserCompanyDataSource( client.db().collection( 'userCompanies' ) as unknown as Collection<CompanyDbObject> ),
  userProjectsApi: new UserProjectsDataSource( client.db().collection( 'userCompanies' ) as unknown as Collection<ProjectDbObject>)
} as Datasources)