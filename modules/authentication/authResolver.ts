import {
  AuthSuccessResponse,
  LoggedOut,
  MutationInitVerificationArgs,
  MutationLogoutArgs,
  MutationVerifyArgs,
  Resolvers,
  UserAuthStatus
} from '@gen/masterTypes'
import { TwilioAPIFailure } from '@/errors/CustomErrors'
import { getRedisClient } from '@/redisConnect'

const getClient = () => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  return new (require( 'twilio' ))( accountSid, authToken );
}

export const authResolver: Resolvers = {
  Mutation: {
    initVerification: async function (parent: any, { input }: MutationInitVerificationArgs): Promise<AuthSuccessResponse> {
      let response: AuthSuccessResponse;
      try {
        response = await getClient().verify.services( process.env.SID )
          .verifications
          .create( { to: input.phone, channel: input.channel } )

        return {
          sid: response.sid,
          serviceSid: response.serviceSid,
          accountSid: response.accountSid,
          to: response.to,
          channel: response.channel,
          status: response.status,
          valid: response.valid
        }
      } catch (e: any) {
        throw new TwilioAPIFailure( e.toString() )
      }
    },

    verify: async (parent: any, { input: { code, phone } }: MutationVerifyArgs): Promise<AuthSuccessResponse> => {
      let resp: AuthSuccessResponse;

      try {
        resp = await getClient().verify.services( process.env.SID )
          .verificationChecks
          .create( { to: phone, code } )

        const redisClient = getRedisClient()
        if ( resp.status === UserAuthStatus.Approved.toLowerCase() ) {
          await redisClient.set( phone, 'true', {
            EX: 30 * 2
          })
        }

        return {
          sid: resp.sid,
          serviceSid: resp.serviceSid,
          accountSid: resp.accountSid,
          to: resp.to,
          channel: resp.channel,
          status: resp.status,
          valid: resp.valid
        }
      } catch (e: any) {
        throw new TwilioAPIFailure( e.toString() )
      }
    },

    logout: async (parent: any, args: MutationLogoutArgs): Promise<LoggedOut> => {
      return {
        status: UserAuthStatus.LoggedOut
      }
    }
  }
}