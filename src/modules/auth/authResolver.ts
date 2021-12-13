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
import { connectRedis } from '@/redisClient'
import { getTwilioClient } from '@/twilioClient'

export const authResolver: Resolvers = {
  Mutation: {
    initVerification: async function (_parent: any, { input }: MutationInitVerificationArgs): Promise<AuthSuccessResponse> {
      let response: AuthSuccessResponse;
      try {
        response = await getTwilioClient().verify.services( process.env.SID )
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

    verify: async (_parent: any, { input: { code, phone } }: MutationVerifyArgs): Promise<AuthSuccessResponse> => {
      let resp: AuthSuccessResponse;

      try {
        resp = await getTwilioClient().verify.services( process.env.SID )
          .verificationChecks
          .create( { to: phone, code } )

        const redisClient = await connectRedis()
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

    logout: async (_parent: any, _args: MutationLogoutArgs): Promise<LoggedOut> => {
      return {
        status: UserAuthStatus.LoggedOut
      }
    }
  }
}