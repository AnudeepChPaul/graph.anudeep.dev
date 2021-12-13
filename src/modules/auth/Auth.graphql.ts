import { gql } from 'apollo-server-core'

export default gql`
    enum UserAuthStatus {
        APPROVED,
        PENDING,
        LOGGED_OUT
    }

    type AuthSuccessResponse {
        sid: String
        serviceSid: String
        accountSid: String
        to: String!
        channel: String!
        status: String!
        valid: Boolean!
    }

    type LoggedOut {
        status: String!
    }

    input AuthInput {
        phone: String!
        channel: String!
    }

    input CredentialVerification {
        code: String!
        phone: String!
    }

    input LogoutInput {
        token: String!
    }

    type Mutation {
        initVerification(input: AuthInput!): AuthSuccessResponse!
        verify(input: CredentialVerification!): AuthSuccessResponse!
        logout(token: LogoutInput!): LoggedOut!
    }
`