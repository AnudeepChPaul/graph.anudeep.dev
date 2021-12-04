import { Company, Introduction, Project, Skill, SkillCategory } from '../../generated/masterTypes'
import faker, { company } from 'faker';

const data: Introduction[] = new Array(2).fill(0).map(el => ({
  name: faker.name.findName(),
  designation: faker.name.jobTitle(),
  email: faker.internet.email(),
  mobile: faker.phone.phoneNumber(),
  aboutMe: "Full Stack Developer with 5 years 8 months of experience in Hybrid App Development." +
    "Seeking a Fullstack role that enriches my skills, architectural knowledge and talent to the best.",
  selected: true,
  id: faker.datatype.uuid()
} as Introduction))

const companies: Company[] = new Array(3).fill(0).map(el => ({
  uniqueId: faker.datatype.uuid(),
  name: faker.company.companyName(),
  userDesignation: faker.name.jobTitle(),
  startDate: faker.date.past().toDateString(),
  endDate: faker.date.past().toDateString(),
  projects: []
} as Company))

const skillCategories = [
  'LANGUAGE',
  'FRAMEWORK_LIBRARY_SERVICES',
  'OPERATING_SYSTEM_TOOLS',
  'TOP_10'
]

const skills = new Array(40).fill(0).map((el, index) => ({
  uniqueId: faker.datatype.uuid(),
  displayName: faker.name.jobTitle(),
  logo: faker.image.sports(),
  category: [skillCategories[index % 4]]
} as Skill))

const allSkills = new Array(10).fill(0).map(el => ({
  uniqueId: faker.datatype.uuid(),
  displayName: faker.name.jobTitle(),
  logo: faker.image.sports()
} as Skill))

const projects = new Array(7).fill(0).map((el, index) => ({
  uniqueId: faker.datatype.uuid(),
  userRole: faker.name.jobTitle(),
  name: faker.company.companyName(),
  roleDescription: faker.name.jobDescriptor(),
  companyId: companies[index % 3].uniqueId
} as Project))

export function getIntro() {
  return data.filter(data => !!data.selected)[0]
}

export function getAllSkills() {
  return skills
}

export function getTop10Skills() {
  return skills.filter(skill => skill.category.includes(skillCategories[3] as SkillCategory))
}

export function getAllCompanies() {
  return companies
}

export function getProjectsByCompany(companyId: string) {
  return projects.filter(project => project.companyId === companyId)
}