import {
  Company,
  CompanyDbObject,
  CompanyInput,
  Introduction,
  IntroductionDbObject,
  IntroductionInput,
  Project,
  ProjectDbObject,
  ProjectInput,
  Skill,
  SkillCategory,
  SkillDbObject,
  SkillInput,
  Success
} from '@gen/masterTypes'
import faker from 'faker';
import { MongoDataSource } from 'apollo-datasource-mongodb'
import { DataSourceConfig } from 'apollo-datasource';
import { Context } from '@/dataSources';
import { log } from '@utils/util';
import { ObjectId } from 'mongodb'
import { UnknownQueryError } from '@/errors/CustomErrors'

const data: Introduction[] = new Array( 2 ).fill( 0 ).map( el => ({
  name: faker.name.findName(),
  designation: faker.name.jobTitle(),
  email: faker.internet.email(),
  mobile: faker.phone.phoneNumber(),
  aboutMe: "Full Stack Developer with 5 years 8 months of experience in Hybrid App Development." +
    "Seeking a Fullstack role that enriches my skills, architectural knowledge and talent to the best.",
  selected: true,
  _id: faker.datatype.uuid()
} as Introduction) )

export class UserIntroductionDataSource extends MongoDataSource<IntroductionDbObject, Context> {
  initialize(config: DataSourceConfig<Context>) {
    if ( super.initialize ) {
      super.initialize( config )
    }
  }

  async getIntro(): Promise<Introduction[]> {
    return this.collection.find( {} ).map(
      (user: IntroductionDbObject) => ({ ...user, _id: user._id.toString() })
    ).toArray()
  }

  async createUserIntro(userIntro: IntroductionInput): Promise<Introduction[]> {
    const inserted = await this.collection.insertOne( { ...userIntro, _id: new ObjectId() } as IntroductionDbObject )
    log( 'Inserted doc: ', JSON.stringify( inserted ) )
    return this.collection.find( { "_id": inserted.insertedId } )
      .map( (doc: any) => ({ ...doc, uniqueId: doc._id.toString() }) )
      .toArray()
  }

  async updateUserIntro(userIntro: IntroductionInput): Promise<Array<Introduction>> {
    const id = new ObjectId( userIntro._id as string )
    const inserted = await this.collection.updateOne( { "_id": id }, { "$set": { ...userIntro, _id: id } } )

    if ( !inserted.modifiedCount && !inserted.matchedCount ) {
      throw new UnknownQueryError();
    }

    const newIntro = await this.collection.find( { "_id": id } ).map(
      (user: IntroductionDbObject) => ({ ...user, _id: user._id.toString() })
    ).toArray()
    return newIntro
  }
}

export class UserSkillsDataSource extends MongoDataSource<SkillDbObject, Context> {
  initialize(config: DataSourceConfig<Context>) {
    if ( super.initialize ) {
      super.initialize( config )
    }
  }

  async getAllSkills(): Promise<Array<Skill>> {
    const allSkills = await this.collection.find().map(
      (skill: SkillDbObject) => ({ ...skill, _id: skill._id.toString() } as Skill) ).toArray()
    return allSkills
  }

  async getTop10Skills(): Promise<Array<Skill>> {
    const top10Skills = await this.collection.find( { "category": SkillCategory.Top_10 } ).toArray()
    return top10Skills.map( skill => ({
      ...skill,
      _id: skill._id.toString(),
      category: skill.category as SkillCategory[]
    }) )
  }

  async createSkill(skill: SkillInput): Promise<Array<Skill>> {
    const inserted = await this.collection.insertOne( { ...skill, _id: new ObjectId() } as SkillDbObject )
    log( 'Inserted doc: ', JSON.stringify( inserted ) )

    const skillArr = await this.collection.find( { "_id": inserted.insertedId } ).map( skill => ({
      ...skill,
      _id: skill._id.toString(),
      category: skill.category as SkillCategory[]
    }) ).toArray()

    return skillArr
  }

  async updateSkill(skill: SkillInput): Promise<Array<Skill>> {
    const _id = new ObjectId( skill._id as string )
    const inserted = await this.collection.updateOne(
      { "_id": _id },
      { $set: { ...skill, _id: _id } as SkillDbObject }
    )

    if ( !inserted.modifiedCount && !inserted.matchedCount ) {
      throw new UnknownQueryError();
    }

    const skills = await this.collection.find( { "_id": _id } ).map(
      (skill: SkillDbObject) => ({
        ...skill,
        _id: skill._id.toString(),
        category: skill.category as SkillCategory[]
      })
    ).toArray()

    return skills
  }

  async removeSkill(skillId: string): Promise<Success> {
    await this.collection.deleteOne( { _id: new ObjectId( skillId ) } )
    return {
      success: true
    }
  }
}

export class UserCompanyDataSource extends MongoDataSource<CompanyDbObject, Context> {
  initialize(config: DataSourceConfig<Context>) {
    if ( super.initialize ) {
      super.initialize( config )
    }
  }

  async getAllCompanies(): Promise<Array<Company>> {
    return await this.collection.find( {} ).map(
      (cmp: CompanyDbObject) => ({ ...cmp, _id: cmp._id.toString() } as Company)
    ).toArray()
  }

  async createCompany(company: CompanyInput): Promise<Array<Company>> {
    const inserted = await this.collection.insertOne( { ...company, _id: new ObjectId() } )
    const companies = await this.collection.find( { "_id": inserted.insertedId } )
      .map( (doc: CompanyDbObject) => ({ ...doc, uniqueId: doc._id.toString(), _id: doc._id.toString() }) )
      .toArray()

    return companies
  }

  async updateCompany(company: CompanyInput): Promise<Array<Company>> {
    const _id = new ObjectId( company._id as string )

    const inserted = await this.collection.updateOne(
      { "_id": _id },
      { $set: { ...company, _id: _id } as CompanyDbObject }
    )

    if ( !inserted.modifiedCount && !inserted.matchedCount ) {
      throw new UnknownQueryError();
    }

    const companies = await this.collection.find( { "_id": _id } )
      .map( (doc: CompanyDbObject) => ({ ...doc, uniqueId: doc._id.toString(), _id: doc._id.toString() }) )
      .toArray()

    return companies
  }

  async removeCompany(companyId: string): Promise<Success> {
    await this.collection.deleteOne( { _id: new ObjectId( companyId ) } )
    return {
      success: true
    }
  }
}

export class UserProjectsDataSource extends MongoDataSource<ProjectDbObject, Context> {
  initialize(config: DataSourceConfig<Context>) {
    if ( super.initialize ) {
      super.initialize( config )
    }
  }

  async getProjectsByCompany(companyId: string): Promise<Array<Project>> {
    const projects = await this.collection.aggregate( [
      {
        '$match': {
          "projects.companyId": new ObjectId( companyId )
        }
      }, {
        '$unwind': '$projects'
      }, {
        '$addFields': {
          'name': '$projects.name',
          'userRole': '$projects.userRole',
          'roleDescription': '$projects.roleDescription'
        }
      }
    ] ).map(
      (project: ProjectDbObject) => ({
        ...project,
        _id: project._id.toString(),
        companyId: companyId
      } as Project)
    ).toArray();

    return projects
  }

  async createProject(companyId: string, project: ProjectInput): Promise<Array<Project>> {
    const _id = new ObjectId( companyId )
    const company = await this.collection.updateOne( { _id: _id },
      { $push: { projects: { ...project, companyId: _id } } } )
    return (await this.getProjectsByCompany( companyId ))
  }

  async removeProject(companyId: string, projectName: string): Promise<Success> {
    await this.collection.updateMany( { _id: new ObjectId( companyId ) }, {
      "$pull": {
        'projects': {
          'name': projectName
        }
      }
    } )
    return {
      success: true
    }
  }
}
