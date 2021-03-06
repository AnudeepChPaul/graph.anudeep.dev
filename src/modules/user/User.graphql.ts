import { gql } from 'apollo-server-core'

export default gql`
type User {
    name: String!
    email: String!
    uniqueId: String!
    address: Address
}

type Address {
    uniqueId: String!
    pincode: Int!
    district: String!
    state: String!
}

type Query {
    userDetails(id: String!): [User]!
}
`