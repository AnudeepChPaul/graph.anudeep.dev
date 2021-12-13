import { gql } from 'apollo-server-core'

export default gql`
    enum SkillCategory {
        LANGUAGE
        FRAMEWORK_LIBRARY_SERVICES
        OPERATING_SYSTEM_TOOLS
        TOP_10
    }

    type Success {
        success: Boolean
    }

    type Introduction @entity{
        _id: String! @id
        name: String! @column
        designation: String! @column
        email: String! @column
        mobile: String! @column
        aboutMe: String! @column
        selected: Boolean! @column
    }

    input IntroductionInput {
        _id: String
        name: String!
        designation: String!
        email: String!
        mobile: String!
        aboutMe: String!
        selected: Boolean!
    }

    type Skill @entity{
        _id: String! @id
        displayName: String! @column
        category: [SkillCategory!]! @column
        logo: String @column
    }

    input SkillInput {
        _id: String
        displayName: String!
        category: [SkillCategory!]!
        logo: String
    }

    type Company @entity{
        _id: String! @id @map(path: "_id")
        name: String! @column
        startDate: String! @column
        endDate: String! @column
        userDesignation: String! @column
        projects: [Project] @column
    }

    input CompanyInput {
        _id: String
        name: String!
        startDate: String!
        endDate: String!
        userDesignation: String!
        projects: [ProjectInput]!
    }

    type Project @entity(embedded: true) {
        companyId: String! @id @map(path:"companyId")
        name: String! @column
        userRole: String! @column
        roleDescription: String! @column
    }

    input ProjectInput {
        name: String!
        userRole: String!
        roleDescription: String!
        companyId: String!
    }

    type Query {
        userIntroduction: [Introduction!]!
        top10: [Skill!]!
        allSkills: [Skill!]!
        allCompanies: [Company!]!
        projectsByCompanyId(companyId: String!): [Project]!
    }

    type Mutation {
        saveUserIntroduction (data: IntroductionInput!): [Introduction!]!
        saveSkill (skill: SkillInput!): [Skill!]!
        saveCompany (company: CompanyInput!): [Company!]!
        saveCompanyProject (projectInput: ProjectInput!): [Project!]!
        removeSkill(skillId: String!): Success!
        removeCompany(companyId: String!): Success!
        removeProject(companyId: String!, nameOfProject: String!): Success!
    }
`
